const csrf = require('csurf');

const setupCsrf = (app) => {
    // CSRF 보호 설정
    app.use(csrf({
        cookie: {
            httpOnly: true,
            key: 'XSRF-TOKEN',
            secure: process.env.NODE_ENV === 'production'
        },
        value: req => req.headers['x-xsrf-token']
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