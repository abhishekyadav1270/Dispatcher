const { json } = require("body-parser");

const contactListsRoutes = (app, store) => {

    // FAV CONTACT LIST

    // *******READ
    app.get('/contactlists/', (req, res) => {
        store.getAllContactLists(req.params.id).then((contacts)=>{
            res.send(contacts)
        }).catch(e=> res.send({error:e}))
    });

    app.get('/contactlists/:id', (req, res) => {
        store.getContactLists(req.params.id).then((contacts)=>{
            res.send(contacts)
        }).catch(e=> res.send({error:e}))
    });

    // ******ADD
    app.post('/addtofav', (req, res) => {
        let contact = req.body;
        let data = {
            mcptt_id: contact.mcptt_id,
            tetra_id: contact.tetra_id,
            dispatcher_id: contact.dispatcher_id,
            contactName: contact.contactName,
        }
        store.insertFavContact(data)
        .then((d)=>{
            res.send(d)
        })
        .catch(e=> res.send(e))
    });


    //******/ DELETE
    app.delete('/contactlists', (req, res) => {
        let contact = req.body;
        let data = {
            mcptt_id: contact.mcptt_id,
            dispatcher_id: contact.dispatcher_id,
            tetra_id: contact.tetra_id,
        }
        store.removeFromFav(data)
        .then((d)=> {
            res.send(d)
        })
        .catch(e=> res.send(e))
    });
};

module.exports = contactListsRoutes;