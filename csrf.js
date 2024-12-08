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

    // Grafana 경로에는 CSRF 미들웨어를 적용하지 않음
    app.use((req, res, next) => {
        if (grafanaRoutes.some(route => req.path.startsWith(route))) {
            next();
        } else {
            csrf({
                cookie: {
                    httpOnly: true,
                    key: 'XSRF-TOKEN',
                    secure: process.env.NODE_ENV === 'production'
                },
                value: req => req.headers['x-xsrf-token']
            })(req, res, next);
        }
    });

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