const winston = require('winston');
const { format, level, prettyPrint } = require('winston');
require('winston-daily-rotate-file');

var date = new Date();
date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
    });
}


const logger = {
    info: winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: timezoned }),
            winston.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
            new (winston.transports.DailyRotateFile)({
                zippedArchive: false,
                datePattern: 'yyyy-MM-DD',
                filename: './logs/log',
                prepend: true,
                format: format.combine(format.timestamp({ format: timezoned }), format.prettyPrint()),
                level: 'info',
                maxFiles: '5'
            })
        ]
    })
}

const remoteLogger = (app, store) => {
    app.get('/log', (req, res) => {

    });

    app.put('/log', (req, res) => {
        // console.log('Incoming data',req.body)
        logger.info.log("info", JSON.stringify(req.body));
        console.log('logger put', JSON.stringify(req.body))
        res.status(200).send(`log added`);
    });

    app.post('/log', (req, res) => {
        logger.info.log("info", JSON.stringify(req.body));
        console.log('logger post', JSON.stringify(req.body))
        res.status(200).send(`log added`);
    })
}

module.exports = remoteLogger;