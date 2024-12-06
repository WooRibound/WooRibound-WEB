const express = require('express');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const setupLogging = require('./logging');
const cookieParser = require('cookie-parser');
const setupCsrf = require('./csrf');

setupLogging(app);

// Vue.js 빌드 결과물 서빙
app.use(express.static('dist'));
app.use(cookieParser());
setupCsrf(app);

// WebSocket 프록시를 가장 먼저 설정
const wsProxy = createProxyMiddleware('/api/live/ws', {
    target: 'ws://grafana.wooribound.com:3000',
    changeOrigin: true,
    ws: true,
    secure: false,
    logLevel: 'debug',
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
        const authString = process.env.GRAFANA_AUTH;
        if (authString) {
            const auth = Buffer.from(authString).toString('base64');
            proxyReq.setHeader('Authorization', `Basic ${auth}`);
        }
        console.log('WebSocket connection attempt');
    },
    onOpen: (proxySocket) => {
        console.log('WebSocket connection opened');
    },
    onError: (err, req, res) => {
        console.error('WebSocket Proxy Error:', err);
    }
});

// WebSocket 라우팅을 가장 먼저 설정
app.use('/api/live/ws', wsProxy);


// Grafana 관련 모든 경로 처리
app.use([
    '/d-solo',
    '/d',
    '/api/plugins',
    '/api/frontend',
    '/api/prometheus',
    '/api/frontend-metrics',
    '/api/datasources',
    '/api/annotations',
    '/api/ds',
    '/public',
    '/api/dashboards'
], createProxyMiddleware({
    target: 'http://grafana.wooribound.com:3000',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq) => {
        const authString = process.env.GRAFANA_AUTH;
        if (!authString) {
            console.error('GRAFANA_AUTH environment variable is missing');
            return;
        }
        const auth = Buffer.from(authString).toString('base64');
        proxyReq.setHeader('Authorization', `Basic ${auth}`);
        console.log('Proxying Grafana request:', proxyReq.path);
    }
}));


// API 요청 프록시
app.use('/api', createProxyMiddleware({
    target: 'https://private-alb.wooribound.com',
    changeOrigin: true,
    secure: false
}));

// OAuth 관련 요청도 Private ALB로 프록시
app.use('/oauth2', createProxyMiddleware({
    target: 'https://private-alb.wooribound.com',
    changeOrigin: true,
    pathRewrite: {
        '^/oauth2': '/oauth2'
    },
    secure: false
}));

// 모든 요청을 Vue 앱으로 전달, csrf토큰 전달
app.get('*', async (req, res) => {
    try {
        // index.html 읽기
        const html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
        const token = req.csrfToken();

        res.cookie('XSRF-TOKEN', token);  // 쿠키로

        // CSRF 토큰을 meta 태그로 삽입
        const modifiedHtml = html.replace(
            '</head>',
            `<meta name="csrf-token" content="${token}"></head>`
        );

        // 모든 경로에서 수정된 index.html 반환
        // (Vue Router의 History 모드를 위해 모든 경로에서 같은 HTML 제공)
        res.setHeader('Content-Type', 'text/html');
        res.send(modifiedHtml);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// http 서버 생성 및 WebSocket 핸들러 추가
const server = require('http').createServer(app);
server.on('upgrade', wsProxy.upgrade);

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});