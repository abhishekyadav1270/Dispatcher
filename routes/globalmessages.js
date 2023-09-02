const globalMessagesRoutes = (app, fs) => {

    // variables
    const dataPath = './data/globalmessages.json';

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
    app.get('/globalmessages', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            var resp = [];
            let d = JSON.parse(data);
            var i=0;
            for(var key in d){
                resp[i++] = d[key];
            }
            res.send(resp.reverse());
        });
    });

    // CREATE
    app.post('/globalmessages', (req, res) => {

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
    app.put('/globalmessages', (req, res) => {

        readFile(data => {
            console.log(req.query.toId)
            // add the new user
            let body = req.body
            let states = {};
            for(var key in data){
                //console.log(data[key])
                if( data[key].toId.toString()===req.query.toId.toString() && data[key].id.toString()===req.query.id.toString()){
                    console.log(data[key])
                    if(data[key].sdsStates){
                        states = data[key].sdsStates;
                        data[key].sdsStates = states.concat(body);
                    }else{
                        data[key].sdsStates = [body];                        
                    }
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

module.exports = globalMessagesRoutes;