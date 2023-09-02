// import other routes
const userRoutes = require('./users');
const calls = require('./calls');
const sdsMessages = require('./sdsMessages');
const sdsAlerts = require('./sdsAlerts');
const globalmessages = require('./globalmessages');
const usermessages = require('./usermessages');
const status = require('./status');
const contactlists = require('./contactlists');
const remoteLogger = require('./remoteLog');
const dgna = require('./dgna');
//const sdsFile = require('./sdsFileRoutes')
const sdsFileUplaod = require('./sdsFile')

const appRouter = (app, store) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the MCX Storage development layer api-server');
    });
    app.get('/connectionStatus', (req, res) => {
        res.send({success:true});
    });

    // // other routes
    userRoutes(app, store);
    calls(app,store);
    sdsMessages(app,store);
    sdsAlerts(app,store);
    globalmessages(app,store);
    usermessages(app,store);
    status(app,store);
    contactlists(app,store);
    remoteLogger(app,store);
    dgna(app,store);
    sdsFileUplaod(app,store);
};

module.exports = appRouter;