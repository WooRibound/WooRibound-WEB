const morgan = require('morgan');
const fs = require('fs');

const setupLogging = (app) => {
    const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });

    morgan.token('memory', () => {
        const used = process.memoryUsage();
        return `Memory: ${Math.round(used.heapUsed / 1024 / 1024)}MB`;
    });

    app.use(morgan(':remote-addr :method :url :status :response-time ms :user-agent :memory :date[iso]', {
        stream: accessLogStream
    }));
    app.use(morgan('dev'));
};

module.exports = setupLogging;