"use strict"

module.exports = class Appointment {
    static regularDuration = 1;
    #uuid;
    #name;
    #description;
    #owner = 1; //Appointment_Collection.owner;
    #from;
    #to;
    #participants;
    #files;
    #modelType = "Appointment"
    /**
     @name Constructor
     @description Standardconstructor für einen Termin
     @param {String} name
     @param {String} description
     @param {Date|undefined} from
     @param {Date|undefined} to
     @param {[Contact]|undefined} participantsx
     @param {[File]|undefined} files
     */

    constructor(name, description, from = new Date(),to = new Date().addHours(Appointment.regularDuration), participants = [], files = []) {
        this.#name = name;
        this.#description = description;
        this.#from = from;
        this.#to = to;
        this.#participants = participants;
        this.#files = files;
        this.#modelType = "Appointment";
    }

    get uuid() { return this.#uuid; }
    set uuid(value) { this.#uuid = value;}
    get description () { return this.#description; }
    set description(value) { this.#description = value; }
    get owner() { return this.#owner; }
    set owner(value) { this.#owner = value; }
    get from() { return this.#from; }
    set from(value) { this.#from = value; }
    get to() { return this.#to; }
    set to(value) {this.#to = value; }
    get participants() { return this.#participants; }
    set participants(value) { this.#participants = value; }
    get files() { return this.#files; }
    set files(value) { this.#files = value; }
    get name() { return this.#name; }
    set name(value) { this.#name = value; }
    get modelType() { return this.#modelType; }
    set modelType(value){this.#modelType = value;}

}

/**
 *
 * @param {int} h
 * @returns {Date}
 */
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

