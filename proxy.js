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

app.listen(8080);