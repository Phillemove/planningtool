"use strict"

// Class Adress
// Link between Database and Programm. Used as a form of an Entity Class
module.exports = class Adress {
    #houseNumber;
    #street;
    #location;
    #modelType;

    /**
     *
     * @param {String} houseNumber
     * @param {String} street
     * @param {Location} location
     */
    constructor(houseNumber, street, location) {
        this.#houseNumber = houseNumber;
        this.#street = street;
        this.#location = location;
        this.modelType = "Adress";
    }

    get houseNumber() { return this.#houseNumber; }

    /**
     *
     * @param {String} value
     */
    set houseNumber(value) { this.#houseNumber = value; }
    get street() { return this.#street; }

    get modelType(){return this.#modelType;}
    set modelType(value){this.#modelType = value;}
    /**
     *
     * @param {String} value
     */
    set street(value) { this.#street = value; }
    get location() { return this.#location; }

    /**
     *
     * @param {Location} location
     */
    set location(location) { this.#location = location}
}