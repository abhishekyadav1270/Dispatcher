//const { json } = require("express");

const individualSdsRoutes = (app, store) => {

    // ***** READ
    app.get('/sdsTextMessage', (req, res) => {
        let UEid = req.query.UEid ? req.query.UEid : "0000"
        store.getAllSDS(req.query.id, UEid).then((data) => {
            res.send(data)
        }).catch(e => res.send({ error: e }))
    });

    //SDS INDV MESSAGES
    app.get('/sdsTextMessage/:id', (req, res) => {
        let id = req.params.id;
        let UEid = req.params.UEid ? req.params.UEid : '0000';
        store.getIndividualSDS(id, UEid).then((contacts) => {
            res.send(contacts)
        }).catch(e => res.send({ error: e }))
    });

    //SDS Messages User wise 
    app.get('/sdsUserTextMessage', (req, res) => {
        const { disp_id, toId, per_page, current_page, UEid } = req.query;
        store.getUserSDS(disp_id, toId, per_page, current_page, UEid).then((contacts) => {
            res.send(contacts)
        }).catch(e => res.send({ error: e }))
    });

    app.get('/sdsUserTextMessageList', (req, res) => {
        const { disp_id, UEid } = req.query;
        store.getUnreadSDS(disp_id, UEid).then((contacts) => {
            res.send(contacts)
        }).catch(e => res.send({ error: e }))
    });

    //SDS GROUP MESSAGES
    app.get('/sdsGroupMessage', (req, res) => {
        let id = req.query.id;
        let UEid = req.query.UEid ? req.query.UEid : '0000';
        store.getGroupSDS(id, UEid).then((contacts) => {
            res.send(contacts)
        }).catch(e => res.send({ error: e }))
    });

    //ALL SDS PAGINATION
    app.get('/getSdsMessages/', (req, res) => {
        const { id, type, per_page, current_page, UEid } = req.query;
        store.getSDSPagn(id, type, per_page, current_page, UEid).then((rows) => {
            res.send(rows)
        }).catch(e => res.send({ error: e }))
    });

    // ***** CREATE
    app.post('/sdsTextMessage', (req, res) => {
        let sds = req.body;
        console.log('SDS INSERT: ', req.body)
        store.insertNewSDS(sds)
            .then((d) => {
                res.send(d)
            })
            .catch(e => res.send({ error: e }))
    });


    //UPDATE
    app.put('/sdsTextMessage', (req, res) => {
        console.log('SDS Update: ', req.body)
        store.updateSDSstate(req.body)
            .then((d) => {
                res.send(d)
            })
            .catch(e => res.send({ error: e }))
    });

    app.get('/sdsCountUnread/:toId', (req, res) => {
        let toId = req.params.toId;
        let UEid = req.params.UEid ? req.params.UEid : '0000';
        store.countUnreadSDS(toId, UEid)
            .then((data) => { res.send(data) })
            .catch((err) => { res.send({ status: "failed", error: err }) })
    });

    app.put('/sdsMessageViewed', (req, res) => {
        let msgId = req.body.msgId;
        let dispId = req.body.disp_id;
        let UEid = req.body.UEid ? req.body.UEid : "0000";
        store.updateSDSView(msgId, dispId, UEid).then((data) => {
            res.send(data);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        })
    })
    app.get('/getChatList',async(req,res)=>{
        let {dispId, UEid, per_page, current_page} = req.query;
        try{
            let contactIds = await store.getUserChatList(dispId,UEid);
            let messages = await store.getSdsByUser(dispId,UEid);
            let userList = []
            if( contactIds && contactIds.length> 0 && messages && messages.length >0){
                for(let contact of contactIds) {
                    for(let message of messages) {
                        if(message.contactId == contact.contactId){
                            userList.push(message)
                            break;
                        }
                    }
                }
            }
            res.send(userList)
        }catch(err){
            console.log(" error in fetching chat list  ",err);
            res.send([])
        }
    })

};

module.exports = individualSdsRoutes;