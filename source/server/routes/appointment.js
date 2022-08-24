"use strict";
const express = require("express");
const Appointment = require("../../models/Appointment");
const AppointmentCollection = require("../../models/Appointment_Collection");
let router = express.Router();
const path = require("path");

const appointmentCollection = new AppointmentCollection();

// Gives generall site structure as HTML
router.get("/", (req, res) =>
{
    res.set("Content-Type", "text/html");
    res.sendFile(
        path.join(__dirname, "../../view/static/html/Appointments.html")
    );
});

// Sends Edit/New Appointment View to Client
router.get("/html/edit", (req, res) =>
{
    res.set("Content-Type", "text/html");
    res.sendFile(
        path.join(__dirname, "../../view/static/html/editAppointment.html")
    );
});

// Sends Show individual Entry View to Client
router.get("/html/show", (req, res) =>
{
    res.set("Content-Type", "text/html");
    res.sendFile(
        path.join(__dirname, "../../view/static/html/showAppointment.html")
    );
});

// Sends List View as HTML to Client
router.get("/html/list", (req, res) =>
{
    res.set("Content-Type", "text/html");
    res.sendFile(
        path.join(__dirname, "../../view/static/html/listAppointments.html")
    );
});

// Endpoint to get all Appontments (without Files)
router.get("/list", (req, res) =>
{
    res.set("Content-Type", "text/json");
    res.send(appointmentCollection.appointments);
});

// Endpoint to get Data for one specific Appointments (inclusive Files)
router.post("/show", (req, res) =>
{
    if (req.body.uuid != null)
    {
        appointmentCollection.getAppointment(req.body.uuid).then((appointment) =>
        {
            res.set("Content-Type", "text/json");
            res.send(appointment);
        });
    }
});

// Endpoint for deleting Appointments from DB
router.post("/delete", (req, res) =>
{
    let { uuid } = req.body;
    appointmentCollection.deleteAppointment(uuid).then(() =>
    {
        res.status(200).send(true);
    });
});

// Endpoint for creating or editing Appointments in DB
router.post("/edit", (req, res) =>
{
    let { uuid, name, description, from, to, participants, files } = req.body;
    if (name != '')
    {
        if (uuid == "new")
        {
            // New Appointment
            let appointment = new Appointment(name, description, from, to, participants, files);
            appointmentCollection.saveAppointment(appointment).then((id) =>
            {
                if (id != null)
                {
                    res.status(200).send(true);
                    // Appointment successfully saved to DB
                }
            });
        } else
        {
            // Edit existing Appointment
            let appointment = new Appointment(name, description, from, to, participants, files);
            appointment.uuid = uuid;
            appointmentCollection.updateAppointment(appointment).then((id) =>
            {
                if (id != null)
                {
                    res.status(200).send(true);
                    // Appointment successfully updated
                }
            });
        }
    }
});

module.exports = router;
