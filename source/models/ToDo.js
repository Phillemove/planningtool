"use strict"
// follwing import might cause circular dependency and causes logging to crash
// const Contact_Collection = require("./Contact_Collection")

module.exports = class ToDo {
    #title;
    #description;
    #done = false;
    #dueDate;
    #owner = 1;
    #createdAt = new Date();
    #participants;
    #uuid;
    #files;
    #modelType = "ToDo";
    /**
     @param {String} title
     @param {String} description
     @param {Date|undefined} dueDate
     @param {[Contact]|undefined} participants
     @param {[File]|undefined} files
     */
    constructor(title, description, dueDate = null, participants = [], files = []) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#participants = participants;
        this.#files = files;
        this.#modelType = "ToDo"
    }

    get title() { return this.#title; }
    set title(title) { this.#title = title }
    get description() { return this.#description; }
    set description(description) { this.#description = description }
    get done() { return this.#done; }
    set done(state) { this.#done = state; }
    get dueDate() { return this.#dueDate; }
    set dueDate(date) { this.#dueDate = date; }
    get owner() { return this.#owner; }
    set owner(person) { this.#owner = person; }
    get createdAt() { return this.#createdAt; }
    get participants() { return this.#participants; }
    get uuid() { return this.#uuid; }
    set uuid(value) { this.#uuid = value; }
    get files() { return this.#files; }
    set files(value) { this.#files = value; }
    get modelType() { return this.#modelType; }
    set modelType(value){this.#modelType = value;}

    toJSON() {
        return {
            title:this.#title,
            description:this.#description,
            doneState:this.#done,
            dueDate:this.#dueDate,
            owner:this.#owner,
            createdAt:this.#createdAt,
            participants:this.#participants,
            files:this.#files,
            uuid:this.#uuid,
        }
    }
}