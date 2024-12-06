const csrf = require('csurf');

const setupCsrf = (app) => {
    // CSRF 보호 설정
    app.use(csrf({
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
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