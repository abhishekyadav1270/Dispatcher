const userMessagesRoutes = (app, fs) => {

    // variables
    const dataPath = './data/usermessages.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/usermessages', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            console.log(req.query.toId);
            if (err) {
                throw err;
            }
            if(req.query.toId){
                data =JSON.parse(data);
                console.log(typeof(data));
                var rep = [];
                console.log(Object.keys(data).length)
                //var i=Object.keys(data).length;
                var i=0;
                for(var key in data){
                    if(data[key].user.id.toString()===req.query.toId.toString()||data[key].fromId.toString()===req.query.toId.toString()){                        
                        rep[i++] = data[key];                        
                    }
                }                
                res.send(rep.reverse());
            }else{
                res.send([]);
            }
        });
    });

    // CREATE
    app.post('/usermessages', (req, res) => {

        readFile(data => {
            const newUserId = Object.keys(data).length + 1;

            // add the new user
            data[newUserId.toString()] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            });
        },
            true);
    });


    // UPDATE
    app.put('/usermessages', (req, res) => {

        readFile(data => {
            console.log(req.query.toId)
            // add the new user
            let body = req.body
            for(var key in data){
                //console.log(data[key])
                if( data[key].user.id.toString()===req.query.toId.toString() && data[key].id.toString()===req.query.id.toString()){
                    console.log(data[key])
                    data[key] = body;
                }
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${req.query.toId} updated`);
            });
        }, true);
    });


    // DELETE
    // app.delete('/users/:id', (req, res) => {

    //     readFile(data => {

    //         // add the new user
    //         const userId = req.params["id"];
    //         delete data[userId];

    //         writeFile(JSON.stringify(data, null, 2), () => {
    //             res.status(200).send(`users id:${userId} removed`);
    //         });
    //     },
    //         true);
    // });
};

module.exports = userMessagesRoutes;