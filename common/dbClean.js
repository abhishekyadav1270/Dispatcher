const cron = require('node-cron');
const store = require('./store');
require('dotenv').config("./env");

const scheduleJob = () => {
  let log_duration = parseInt(process.env.REACT_APP_LOG_DURATION ? process.env.REACT_APP_LOG_DURATION : 7);
  let time = (process.env.REACT_APP_TIME ? process.env.REACT_APP_TIME : "01:00");
  if (time.length > 0) {
    if (time.includes(':')) {
      let timeVal = time.split(":")
      if (timeVal.length > 1) {
        cron.schedule(`${parseInt(timeVal[1])} ${parseInt(timeVal[0])} * * *`, () => {
          store.deleteOldLogs(log_duration).then((data) => {
            console.log(data)
          })
          .catch((er) => console.log(er));
        });
      }
    }
  }
};
module.exports = scheduleJob;