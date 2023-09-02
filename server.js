const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const scheduleJob = require('./common/dbClean');
const fs = require('fs');
const serverc = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
},app);

app.use('/uploads',express.static('routes/uploads'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const store = require('./common/store');
store.sdsIndex().then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log(err);
});
store.callIndex().then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log(err);
});
store.alertIndex().then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log(err);
});
const routes = require('./routes/routes.js')(app, store);

//MCX
// const store = require('./src/MCXClient/knex/store');
// const routes = require('./src/MCXClient/routes/routes.js')(app, store);

const server = serverc.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});

scheduleJob();