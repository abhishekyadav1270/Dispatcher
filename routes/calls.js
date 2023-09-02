const individualCallRoutes = (app, store) => {

    //INDV CALLS
    app.get('/individualCall/:id', (req, res) => {
        store.getIndvCalls(req.params.id).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    //GROUP ALERTS
    app.get('/groupCall/:id', (req, res) => {
        store.getGroupCalls(req.params.id).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    //Get call on callId
    app.get('/callId', (req, res) => {
        const { callId } = req.query;
        store.getCallState(callId).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    //***** CREATE
    app.post('/calls', (req, res) => {
        let sds = req.body;
        if (sds.callId) {
            store.addNewcall(sds)
                .then((d) => {
                    res.send(d)
                })
                .catch(e => res.send({ satus: 'failed', error: e }))
        }
        else res.send({ status: 'failed', error: 'callId missing' })
    });


    //***** UPDATE
    app.put('/calls', (req, res) => {
        if (req.body.callId) {
            store.updateCallstate(req.body)
                .then((d) => {
                    res.send(d)
                })
                .catch(e => res.send({ satus: 'failed', error: e }))
        }
        else res.send({ satus: 'failed', error: 'Missing callId' })
    });
};

module.exports = individualCallRoutes;