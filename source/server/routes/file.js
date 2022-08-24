"use strict"
const express = require('express')
const multer = require('multer')
const uuid = require('uuid').v4

const FileCollection = require('../../models/File_Collection');
const path = require('path')
const fs = require('fs')
const File = require('../../models/File.js');
const Repository = require('../../Repository');

const fileCollection = new FileCollection()

//Definition of our file storage and adding original names of files to our storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads')
    },
    filename: (req, file, callback) => {
        const { originalname } = file
        callback(null, `${uuid()}-${originalname}`)
    }
})

const upload = multer({ storage: storage })

let router = express.Router()

//Endpoint to display uploadfiles.html = upload manager
router.get('/html/show', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/uploadFiles.html'))
})

//Endpoint to receive our filearray
router.get('/filemanager', (req, res) => {
    fileCollection.getFilesFromDB()
        .then((fileArray) => {
            res.set('Content-Type', 'text/json')
            res.status(200)
            res.send(fileArray)
        })
})

//Endpoint to open files after clicking on them
router.get('/uploads/:id', (req, res) => {
    const { id } = req.params;
    fileCollection.getFilesByID(id)
        .then((allFiles) => {
            console.log("/uploads/getAllFileNames()" + " " + allFiles[0].uuid)
            res.set('Content-Type', allFiles[0].filetype)
            res.status(200)
            res.sendFile(path.join(__dirname, '../../' + allFiles[0].fileURL))
        })
})

//Endpoint to delete files from server & database
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    fileCollection.getFilesByID(id)
        .then((allFiles) => {
            fileCollection.deleteFiles(allFiles[0].fileURL)
        })

    const deleted = fileCollection.deleteFileById(id)
    if (deleted) {
        //204 = resource deleted succesfully
        res.sendStatus(204)
    } else {
        //409 = conflict
        res.sendStatus(409)
    }
})

router.get('/', (req, res) => {
    getFiles()
        .then(file => {
            res.set('Content-Type', 'text/json');
            res.send(file);
        })
})

//Endpoint to upload files to filesystem
router.post('/file', upload.array('file'), (req, res) => {
    console.log("File succesfuly uploaded!")
    Repository.saveFile(req.files[0])
    fileCollection.getAllFileNames()
    // return res.json({ status: 'Datei wurde erfolgreich hochgeladen!', steps: 'Bitte kehren Sie auf die vorherige Seite zurück!' })
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect('back');
})

//Endpoint to receive index of files from view
router.post('/fileIndex', (req, res) => {
    let fileIndex = req.body.index
    console.log("fileindex" + " " + fileIndex)
    fileCollection.getFileIndexFromView(fileIndex)
})

async function getFiles() {
    return fileCollection.getAllFileNames()
}

async function getTypes() {
    return fileCollection.loadAllTypes()
}

module.exports = router;