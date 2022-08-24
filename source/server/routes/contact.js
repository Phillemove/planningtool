"use strict"
const express = require('express')
const Contact = require("../../models/Contact");
const Adress = require("../../models/Adress.js");
const Location = require("../../models/Location.js");
let router = express.Router()
const ContactCollection = require('../../models/Contact_Collection')
const {json} = require("express");
const path = require('path')

const contactCollection = new ContactCollection();

//Router Class -> Sets API Endpoints for contactbook

//Load Contacts and respond it
router.get('/',  (req, res) => {
    getContacts()
        .then(contact => {
            res.set('Content-Type', 'text/json');
            res.send(contact);
        })
})

//get endpoints -> Respond static html content
router.get('/html/create', (req,res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/createContact.html'))
})

router.get('/html/show', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/contactbook.html'))
})

router.get('/html/details', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/contactdetails.html'))
})

router.get('/html/update', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/updateContact.html'))
})

router.get('/html/delete', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/deleteContact.html'))
})

//delete endpoint -> delete contact by id
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    contactCollection.deleteContact(id).then(delstatus => {
        if(delstatus == true) {
            res.status(200).send("deleted");
        } 
    })
})

//post entpoint -> create new contact
router.post('/create', (req, res) => {
    const { name, surname, email, street, housenumber, zip, location, files } = req.body
    let loc = new Location(zip, location);
    let address = new Adress(housenumber, street, loc);
    let contact = new Contact(name, surname, email, address, files);
    contactCollection.saveContact(contact).then(id => {
        if(id != null) {
            res.status(200).send("created");
        }
    })
})

//put endpoint -> update contact
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, surname, email, street, housenumber, zip, location, files } = req.body
    let contact = contactCollection.getContact(id)
    contact.name = name;
    contact.surname = surname;
    contact.email = email;
    contact.address[0].street = street;
    contact.address[0].houseNumber = housenumber;
    contact.address[0].location[0].zip = zip;
    contact.address[0].location[0].location = location;
    contact.files = files;
    contactCollection.updateContact(contact).then(() => {
        res.status(200).send(true)
    })
})

//Load contacts array from contactcollection and sort entries alphapetically by name
async function getContacts() {
    contactCollection.contacts.sort((a , b) => a.name.localeCompare(b.name))
    return contactCollection.contacts;
}

module.exports = router;