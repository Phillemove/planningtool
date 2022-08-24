"use strict"

// Class Location
// Link between Database and Programm. Used as a form of an Entity Class
module.exports = class Location {
    #zip;
    #location;
    #modelType;

    /**
     *
     * @param {String} zip
     * @param {String} location
     */
    constructor(zip, location) {
        this.#zip = zip;
        this.#location = location;
        this.#modelType = "Location";

    }

    get zip() { return this.#zip; }
    get location() { return this.#location; }
    get modelType(){return this.#modelType;}
    set modelType(value){this.#modelType = value;}

    // Keine Setter, da sich die Werte nicht unabhängig voneinander ändern
}