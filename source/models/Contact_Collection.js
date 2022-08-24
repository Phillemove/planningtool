"use strict"

const Contact = require("../models/Contact.js");
const Repository = require('../Repository');
let Adress = require("../models/Adress.js");
let Location = require("../models/Location.js");

/**
 * Class Contactbook
 * Wrapperclass/Collectionclass for Contacts
 * Link between Model Classes Database and View
 */
module.exports = class Contactbook {

    #contacts = [];

    constructor() {
        this.loadAllContacts();
    }

    /**
     * Load all Contacts from Database, then for each contact load the Address, Location Information and attached files.
     * Storing Location Object in Address Object and Address Object in Contact Object.
     * Pushig Contact into #contacts Array.
     */
    loadAllContacts() {
        if (this.#contacts.length > 0) {
            this.#contacts = [];
        }
        this.loadContacts().then(contacts => {
            contacts.forEach(element => {
                this.loadAddress(element.address).then(address => {
                    this.loadLocation(address[0].location).then(location =>{
                        this.loadContactFiles(element).then(() => {
                            Location = location;
                            address[0].location = Location;
                            Adress = address;
                            element.address = Adress;
                            this.#contacts.push(element);
                        })
                    })        
                })         
            });
        })
    }

    /**
     * Loading all Contacts from Database
     * @returns {[Contact]}
     */
    async loadContacts() {
       return await Repository.getAllContacts();
    }

    /**
     * Loading Location from Databse by ZIP
     * @param {int} ZIP 
     */
    async loadLocation(ZIP) {
        return await Repository.getLocation(ZIP);
    }

    /**
     * Loading Address from Database by UUID
     * @param {int} UUID 
     */
    async loadAddress(UUID) {
        return await Repository.getAddress(UUID);
    }

    /**
     * Loading Address from Database by street and housenumber
     * @param {Adress} address 
     */
    async loadAddressbyStreet(address) {
        return await Repository.getAdressbyStreet(address);
    }

    /**
     * Load all Files belong to given contact
     * @param {Contact} contact 
     */
    async loadContactFiles(contact) {
        return await Repository.getContactFiles(contact);
    }

    get contacts() {
        return this.#contacts;
    }

    /**
     * Create new Contact object
     * @param {String} name
     * @param {String} vorname
     * @param {String} email
     * @param {Adress} adresse
     * @param {[File]|undefined} files
     */
    createContact(name, surname, email, adress, files = []) {
        let newContact = new Contact(name, surname, email, adress, files)
        this.saveContact(newContact)
    }

    /**
     * Safe contact to Database. Therefore check Location and Address and set Foreign Key for Address.
     * Files fromn contact will be stored also in Database
     * @param {Contact} contact
     */
    async saveContact(contact) {
        let location = await this.checkLocation(contact.address.location);
        let address = await this.checkAddress(contact.address, location[0].zip);
        contact.address = address[0].uuid;
        const id = await Repository.saveContact(contact);
        if (contact.files.length > 0) {
            let files = await this.saveContactFiles(id[0], contact.files);
        }
        if (id != null) {
            this.loadAllContacts();
            return id[0];
        } else {
            return null;
        }
    }

    /**
     * Search contact in #contacts Array by uuid
     * @param {int} uuid
     * @returns {Contact|null}
     */
    getContact(uuid) {      
        let found_contact = null
        let found = false
        for (let i = 0; !found && i < this.#contacts.length; i++){
            if(this.#contacts[i].uuid == uuid) {
                found = true;
                found_contact = this.#contacts[i]
            }           
        }
        return found_contact;
    }

    /**
     * Check if Location exists in Database. When not insert it.
     * @param {Location} location 
     */
    async checkLocation(location) {
        let loc = await this.loadLocation(location.zip);
        if (loc.length <= 0) {
            loc = {
                zip: location.zip, 
                location: location.location
            };
            await Repository.saveLocation(loc).then(() => {
                console.log("Update Location Sucessfull");
            })
            loc = await this.loadLocation(location.zip);
        }
        return loc;
    }

    /**
     * Check of Address exists in Database. When not set foreign key for location (zip) and insert it.
     * @param {Adress} address 
     * @param {int} zip 
     */
    async checkAddress(address, zip) {
        let addr = await this.loadAddressbyStreet(address);
        if (addr.length <= 0) {
            addr = {
                houseNumber: address.houseNumber,
                street: address.street,
                location: zip
            };
            await Repository.saveAddress(addr).then(() => {
                console.log("Update Address Sucessfull");
            });
            addr = await this.loadAddressbyStreet(address)
        } 
        return addr;  
    }

    /**
     * Save all files attached to given contact to Database
     */
    async saveContactFiles(contactUUID, filesUUIDs) {
        return await Repository.saveContactFiles(contactUUID, filesUUIDs);
    }

    /**
     * Safe updated contact to Database. Therefore check Location and Address and set Foreign Key for Address.
     * Files from contact will also be stored in Database
     * @param {Contact} contact
     */ 
    async updateContact(contact) { 
        let location = await this.checkLocation(contact.address[0].location[0]);
        let address = await this.checkAddress(contact.address[0], location[0].zip);
        if (contact.files.length == 0) {
            let fileid = await Repository.deleteContactFiles(contact.uuid);
        } else {
            let files = await this.saveContactFiles(contact.uuid, contact.files);
        }
        contact.address = address[0].uuid;
        await Repository.updateContact(contact)
            .then((check) => {
                if(check){
                    this.loadAllContacts();
                    return true;  
                } else {
                    console.log('updateContact check failed')
                    return false;
                }
            })
    }

    /**
     * Delete contact from Database by uuid, and all linked Files attached to contact
     * @param {int} uuid
     */
    async deleteContact(uuid) {
        const fileid = await Repository.deleteContactFiles(uuid);
        const id = await Repository.deleteContact(uuid);
        if(id != null && fileid != null) {
            this.loadAllContacts();
            return true;
        } else {
            return false;
        }
    }
}