const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({ filename: 'combined.log' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;

// winston-daily-rotate-file이라는 패키지로 날짜별로 관리 가능.
// db에도 넣을 수 있다.(알아봐야 함.)