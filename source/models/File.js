"use strict"

module.exports = class File {
    #id;
    #content;
    #modelType;
    /**
     *
     * @param {Blob} file
     */
    constructor(file) {
        this.#content = file;
        this.#modelType = "File";
    }


    //Getter & Setter
    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get content() { return this.#content; }
    get modelType(){return this.#modelType;}
    set modelType(value){this.#modelType = value;}
    /**
     *
     * @param {Blob} value
     */
    set content(value) { this.#content = value; }

}