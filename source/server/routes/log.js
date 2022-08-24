const express = require('express');
const LogCollection = require("../../models/Log_Collection");
let router = express.Router();
const path = require("path");

const logCollection = new LogCollection();

// Gets all Logs
router.get("/", (req, res) =>
{
    logCollection.loadAllLogs()
    .then(() => {
        res.set("Content-Type", "text/json");
        res.send(logCollection.logs);
    })
});

/**
 * send the main HTML Element
 */
router.get('/html/surrounder', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/logging.html'))
})

/**
 * send the HTML Element for every Log
 */
router.get('/html/log', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/log.html'))
})

router.post('/appointment', (req, res) => {
    if (req.body.uuid != null)
    {
        logCollection.getAppointmentLogs(req.body.uuid)
        .then((appointmentlogs) => {
            res.set("Content-Type", "text/json");
            res.send(appointmentlogs);
        })
    }
})

function sortLogs(){

}


module.exports = router;