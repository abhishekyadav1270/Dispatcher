//const { json } = require("express");

const dgnaRoutes = (app, store) => {

    //DGNA LIST
    app.get('/dgna/:id', (req, res) => {
        store.getDGNAlists(req.params.id).then((dg)=>{
            // dg.grpMembers=JSON.parse(dg.grpMembers)
            res.send(dg)
        }).catch(e=> res.send({error:e}))
    });

    // ***** CREATE
    app.post('/dgna', (req, res) => {
        let dg = req.body;
        if(dg.grpMembers && dg.grpMembers.length>0){
            dg.grpMembers=JSON.stringify(dg.grpMembers);
            store.insertDGNA(dg)
            .then((d)=>{
                res.send(d)
            })
            .catch(e=> res.send({error:e}))
        }
        else return res.send({status:'failed',msg:'missing data to insert'})
    });


    //UPDATE
    app.put('/dgna', (req, res) => {
        let dg = req.body;
        if(dg.grpMembers && dg.grpMembers.length>0){
            dg.grpMembers=JSON.stringify(dg.grpMembers);
            store.updateDGNA(dg)
            .then((d)=>{
                res.send(d)
            })
            .catch(e=> res.send({error:e}))
        }
        else return res.send({status:'failed',msg:'missing data to update'})
    });

    app.delete('/dgna', (req, res) => {
        store.deleteDGNA(req.body)
        .then((d)=>{
            res.send(d)
        })
        .catch(e=> res.send({error:e}))
    });

    //USERLISTS
    app.get('/lists/:id', (req, res) => {
        store.getUserlists(req.params.id).then((dg)=>{
            res.send(dg)
        }).catch(e=> res.send({error:e}))
    });

    app.post('/lists', (req, res) => {
        let dg = req.body;
        if(dg.grpMembers && dg.grpMembers.length>0){
            dg.grpMembers=JSON.stringify(dg.grpMembers);
            store.insertLists(dg)
            .then((d)=>{
                res.send(d)
            })
            .catch(e=> res.send({error:e}))
        }
        else return res.send({status:'failed',msg:'missing data to insert'})
    });

    app.put('/lists', (req, res) => {
        let dg = req.body;
        if(dg.grpMembers && dg.grpMembers.length>0){
            dg.grpMembers=JSON.stringify(dg.grpMembers);
            store.updateLists(dg)
            .then((d)=>{
                res.send(d)
            })
            .catch(e=> res.send({error:e}))
        }
        else return res.send({status:'failed',msg:'missing data to insert'})
    });

    app.delete('/lists', (req, res) => {
        store.deleteLists(req.body)
        .then((d)=>{
            res.send(d)
        })
        .catch(e=> res.send({error:e}))
    });

};

module.exports = dgnaRoutes;