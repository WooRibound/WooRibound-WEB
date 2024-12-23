const express = require('express');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const setupLogging = require('./logging');
const cookieParser = require('cookie-parser');
const setupCsrf = require('./csrf');

setupLogging(app);

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


app.use('/kibana', createProxyMiddleware({
    target: 'https://kibana.wooribound.site',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/kibana': '/' // 옵션
    },
    onProxyRes: (proxyRes, req, res) => {
        // 기존 코드 유지
        delete proxyRes.headers['content-security-policy'];
        delete proxyRes.headers['content-security-policy-report-only'];
        proxyRes.headers['content-security-policy'] = "frame-ancestors 'self' https://wooribound.site";
        proxyRes.headers['x-frame-options'] = 'ALLOW-FROM https://wooribound.site';

        // 리다이렉트 URL 수정
        if (proxyRes.headers.location) {
            proxyRes.headers.location = proxyRes.headers.location.replace(
                'kibana.wooribound.site',
                'wooribound.com/kibana'
            );
        }
    }
}));

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

// meta 태그를 추가하는 라우트를 먼저
app.get('*', (req, res, next) => {
    // API 요청이나 정적 파일 요청은 건너뛰기
    if (req.path.startsWith('/api') ||
        req.path.startsWith('/oauth2') ||
        req.path.includes('.')) {  // 정적 파일은 확장자가 있음
        return next();
    }

    try {
        // index.html 읽기
        const html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
        const token = req.csrfToken();

        // CSRF 토큰을 meta 태그로 삽입
        const modifiedHtml = html.replace(
            '</head>',
            `<meta name="csrf-token" content="${token}"></head>`
        );

        console.log('Meta tag included:', modifiedHtml.includes('csrf-token'));
        console.log('Token in HTML:', modifiedHtml.includes(token));

        // HTML 반환
        res.setHeader('Content-Type', 'text/html');
        res.send(modifiedHtml);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 정적 파일 처리
app.use(express.static('dist'));

// http 서버 생성 및 WebSocket 핸들러 추가
const server = require('http').createServer(app);
server.on('upgrade', wsProxy.upgrade);

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});