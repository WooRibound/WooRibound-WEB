const csrf = require('csurf');

const setupCsrf = (app) => {
    // Grafana 관련 경로 목록
    const grafanaRoutes = [
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
        '/api/dashboards',
        '/api/live/ws'
    ];

    // CSRF 보호 설정
    app.use(csrf({
        cookie: {
            httpOnly: true,
            key: 'XSRF-TOKEN',
            secure: process.env.NODE_ENV === 'production'
        },
        value: req => req.headers['x-xsrf-token'],
        // Grafana 경로 무시 설정 추가
        ignore: (req) => {
            return grafanaRoutes.some(route => req.path.startsWith(route));
        }
    }));

    // CSRF 에러 처리 미들웨어
    app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
            res.status(403).send('CSRF token validation failed');
        } else {
            next(err);
        }
    });
};

module.exports = setupCsrf;