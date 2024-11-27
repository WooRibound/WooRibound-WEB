const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Vue.js 빌드 결과물 서빙
app.use(express.static('dist'));

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
        '^/oauth2': '/oauth2'  // path 유지
    },
    secure: false
}));

app.listen(8080);