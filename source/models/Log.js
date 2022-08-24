"use strict";

module.exports = class Log
{
    #uuid;
    #user;
    #change;
    #changedAt;
    #todo_uuid;
    #appointment_uuid;
    #contact_uuid;
    #file_uuid;

    /**
     * @name Constructor
     * @description Standard constructor for Log Entry
     * @param {String} user 
     * @param {String} change - JSON Object Format
     * @param {Date} chagedAt 
     * @param {Integer} todo_uuid 
     * @param {Integer} appointment_uuid 
     * @param {Integer} contact_uuid 
     * @param {Integer} file_uuid 
     */
    constructor(user, change, chagedAt, todo_uuid, appointment_uuid, contact_uuid, file_uuid)
    {
        this.#user = user;
        this.#change = change;
        this.#changedAt = chagedAt;
        this.#todo_uuid = todo_uuid;
        this.#appointment_uuid = appointment_uuid;
        this.#contact_uuid = contact_uuid;
        this.#file_uuid = file_uuid;
    }

    get uuid() { return this.#uuid; }
    set uuid(value) { this.#uuid = value; }
    get user() { return this.#user; }
    set user(value) { this.#user = value; }
    get change() { return this.#change; }
    set change(value) { this.#change = value; }
    get changedAt() { return this.#changedAt; }
    set changedAt(value) { this.#changedAt = value; }
    get todo_uuid() { return this.#todo_uuid; }
    set todo_uuid(value) { this.#todo_uuid = value; }
    get appointment_uuid() { return this.#appointment_uuid; }
    set appointment_uuid(value) { this.#appointment_uuid = value; }
    get contact_uuid() { return this.#contact_uuid; }
    set contact_uuid(value) { this.#contact_uuid = value; }
    get file_uuid() { return this.#file_uuid; }
    set file_uuid(value) { this.#file_uuid = value; }
};