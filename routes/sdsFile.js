const fileUplaod = require('express-fileupload');
const fs = require('fs');
const mime = require('mime');
//const express = require('express')
const maxSize = 1024 * 1024 * 5; //max-size = 5 MB

const sdsFileUplaod = (app, store) => {
    app.use(fileUplaod({
        limits: {
            fileSize: maxSize
        }
    }));

    // app.use(__dirname
    //     + "/uploads/", express.static())

    app.post('/sdsFile', (req, res) => {
        // console.log('file Data before: ', req.files.file)
        try {
            let file = req.files.file;
            console.log('file Data: ', file)
            let fileDetails = {
                name: file.name,
                fileType: req.files.file.mimetype,
                fileId: Math.random().toString(36).slice(2)
            }

            const uploadPath = __dirname
                + "/uploads/" + fileDetails.name;
            console.log('file Upload path: ', uploadPath)

            file.mv(uploadPath, (err) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    fileDetails.path = uploadPath;
                    console.log(fileDetails);
                    store.uploadFiles(fileDetails)
                        .then((d) => {
                            res.send(d);
                        })
                        .catch((err) => {
                            res.send(err);
                        });
                }
            })
        }
        catch (error) {
            console.log("--error in uploading file -",error)
            res.send('file not uploaded!!');
        }
    });

    app.post('/sdsAudioFile', (req, res) => {
        //console.log('file audio Data before: ', req.files.file)
        try {
            let file = req.files.file;
            console.log('file audio Data: ', file)
            let fileDetails = {
                name: file.name,
                fileType: file.mimetype,
                fileId: Math.random().toString(36).slice(2)
            }

            const uploadPath = __dirname
                + "/uploads/" + fileDetails.name;
            console.log('file Upload path: ', uploadPath)

            file.mv(uploadPath, (err) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    fileDetails.path = uploadPath;
                    console.log(fileDetails);
                    store.uploadFiles(fileDetails)
                        .then((d) => {
                            res.send(d);
                        })
                        .catch((err) => {
                            res.send(err);
                        });
                }
            })
        }
        catch (error) {
            console.log("error in uploading file--",error);
            res.send('file not uploaded!!');
        }
    });

    app.get('/sdsFile/:fileId', async (req, res) => {
        let fileId = req.params.fileId;
        let file = await store.getFiles(fileId);
        if (file.length != 0) {
            let individualFile = file[0];
            res.send({
                status: "success", file: {
                    fileName: individualFile.fileName,
                    fileType: individualFile.fileType,
                    uri: `/uploads/${individualFile.fileName}`
                }
            });
        } else {
            res.send({ status: "failed", msg: "File not found" })
        }
    })

    app.get('/sdsFileDownload/:fileId', async (req, res) => {
        let fileId = req.params.fileId;
        console.log('fileId sdsFileDownload..', fileId)
        const file = await store.getFiles(fileId);
        if (file.length > 0) {
            let individualFile = file[0];
            console.log('fileId path sdsFileDownload..', individualFile.filePath)
            fs.readFile(individualFile.filePath, (err, data) => {
                if (err) {
                    res.send({ status: "failed", msg: err });
                }
                else {
                    res.setHeader('Content-disposition', `attachment; filename=${file[0].fileName}`);
                    res.set('Content-Type', file[0].fileType);
                    res.send(data);
                }
            })
        } else {
            res.send({ status: "failed", msg: "File not found" })
        }
    })

    app.get('/sdsFileStreamDownload/:fileId', async (req, res) => {
        try {
            let fileId = req.params.fileId;
            const file = await store.getFiles(fileId);
            if (file.length != 0) {
                let individualFile = file[0];
                let stream = fs.ReadStream(individualFile.filePath);
                res.setHeader('Content-disposition', `attachment; filename=${individualFile.fileName}`);
                res.set('Content-Type', individualFile.fileType);
                stream.pipe(res);
            } else {
                res.send({ status: "failed", msg: "File not found" })
            }
        }
        catch (err) {
            res.send({ status: "failed", msg: err });
        }
    })

}

module.exports = sdsFileUplaod;