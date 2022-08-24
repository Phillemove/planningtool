"use strict"

// Class Contact
// Link between Database and Programm. Used as a form of an Entity Class
module.exports = class Contact {
    #uuid;
    #name;
    #surname;
    #email;
    #address;
    #files;
    #modelType;

    /**
     *
     * @param {String} name
     * @param {String} surname
     * @param {String} email
     * @param {Adress} address
     * @param {[File]|undefined} files
     */
    constructor(name, surname, email, address, files = []) {
        this.#name = name;
        this.#surname = surname;
        this.#email = email;
        this.#address = address;
        this.#files = files;
        this.#modelType = "Contact";
    }

    get uuid() { return this.#uuid; }
    set uuid(value) { this.#uuid = value; }
    get name() { return this.#name; }
    set name(value) { this.#name = value; }
    get surname() { return this.#surname; }
    set surname(value) { this.#surname = value; }
    get email() { return this.#email; }
    set email(value) { this.#email = value; }
    get address() { return this.#address; }
    get files() { return this.#files; }
    set files(value) { this.#files = value; }
    get modelType(){return this.#modelType;}
    set modelType(value){this.#modelType = value;}

    toJSON() {
        return {
            uuid:this.#uuid,
            name:this.#name,
            surname:this.#surname,
            email:this.#email,
            address:this.#address
        }
    }

    /**
     *
     * @param {Adress} value
     */
    set address(value) { this.#address = value; }    
}