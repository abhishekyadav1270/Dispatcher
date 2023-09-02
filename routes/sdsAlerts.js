const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const moment = require('moment');
const alertsRoutes = (app, store) => {

    //****** READ
    app.get('/sdsAlerts', (req, res) => {
        store.getAllAlerts(req.query.id).then((data) => {
            res.send(data)
        }).catch(e => res.send({ error: e }))
    });

    //INDV ALERTS
    app.get('/sdsAlerts/:id', (req, res) => {
        store.getAlerts(req.params.id).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    //GROUP ALERTS
    app.get('/getGroupAlerts/:id', (req, res) => {
        store.getGroupAlerts(req.params.id).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });
    //ALERTS PAGINATION
    app.get('/getAlerts/', (req, res) => {
        const { id, type, per_page, current_page } = req.query;
        store.getAlertsPagn(id, type, per_page, current_page).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });
    //ACTIVITY LOGS
    app.get('/getAllLogs/', (req, res) => {
        const { id, type, per_page, current_page, search } = req.query;
        store.getActivityLogs(id, type, per_page, current_page, search).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    app.get('/getAllLog/', (req, res) => {
        const { id } = req.query;
        store.getAllLogs(id).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    //***** CREATE
    app.post('/sdsAlerts', (req, res) => {
        let sds = req.body;
        store.insertNewSDSAlert(sds)
            .then((d) => {
                res.send(d)
            })
            .catch(e => res.send({ error: e }))
    });


    //***** UPDATE
    app.put('/sdsAlerts', (req, res) => {
        store.updateAlertstate(req.body)
            .then((d) => {
                res.send(d)
            })
            .catch(e => res.send({ error: e }))
    });

    //***** PINNED */
    app.put('/pinAlert', (req, res) => {
        store.pinAlert(req.body)
            .then((d) => {
                res.send(d)
            })
            .catch(e => res.send({ error: e }))
    });

    // Export Activity Logs
    app.get('/exportLogs', (req, res) => {
        let { id, type, fromDate, toDate, UEid } = req.query;
        store.getLogs(id, type, fromDate, toDate, UEid).then(async (data) => {
            data.forEach(element => {
                element.created = moment(element.created).format("DD-MM-YYYY HH:mm:ss")
                console.log(element.created);
                if (element.communicationType == 'CALL' && type === 'all') {
                    // console.log(element.communicationType);
                    element["sdsType"] = "";
                    element["message"] = "";
                    const priority = parseInt(element.callPriority);
                    let pr = 'MED'
                    if (priority <= 5) { // 0 to 5
                        pr = "LOW";
                    }
                    if (priority > 5 && priority <= 11) { // 6 to 11
                        pr = "MED";
                    }
                    if (priority > 11 && priority <= 14) { // 12 to 14
                        pr = "HIGH";
                    }
                    if (priority === 15) {
                        pr = "EMG";
                        if (element.stateType === 'ACKNOWLEDGED') {
                            pr = "ACK";
                        }
                    }
                    element.callPriority = pr
                } else {
                    element["sdsType"] = element.callType;
                    element.callType = "";
                    element["message"] = element.callPriority;
                    element.callPriority = "";
                }
            })
            let csv_data = await new ObjectsToCsv(data).toString({ allColumns: true });
            // let fileName = `ActivityLog${(id)}.csv`;
            // fs.writeFile(`./export/${fileName}`, csv, 'utf8', function (err) {
            //     if (err) {
            //         console.log(err);
            //         res.send({ status: "Failed", error: err });
            //     }
            //     else {
            //         res.send({ status: "Success", url: `/export/${fileName}` });
            //     }
            // });
            res.setHeader('Content-disposition', `attachment; filename=ActivityLog${(id)}.csv`);
            res.set('Content-Type', 'text/csv');
            res.send(csv_data);
        }).catch((err) => {
            console.log(err);
            res.send({ status: "Failed", err })
        })
    })
};

module.exports = alertsRoutes;