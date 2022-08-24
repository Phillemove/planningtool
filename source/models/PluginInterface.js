class PluginInterface {

    /**
     * Initialisation Method. For unpacking files, creating databases...
     * Is executed every Server-Start - Plugin handles Check if Init was successfull in the past
     * for example with a ".init" file, which is created after first successfull initialisation
     * @returns {bool} true if init was successfull
     */
    init() {
        return false;
    }

    /**
     * Returns Plugin Name
     * // Maybe gets the choosen Language and returns Name based on that
     * @returns {String} Plugin Name
     */
    getName() {
        if (!this.name) {
            return null;
        } else {
            return this.name;
        }
    }

    /**
     * Returns Plugin Description
     * // Maybe gets the choosen Language and returns Decription based on that
     * @returns {String} Plugin Description
     */
    getDescription() {
        if (!this.description) {
            return null;
        } else {
            return this.description;
        }
    }

    /**
     * Returns nessecary JaveScript Code for the Plugin to run
     * @returns {String} Jave-Script Functions to be placed in Head of the Site
     */
    getPreload() {
        return "";
    }

    //TODO: Better Names for Content-Methods?
    /**
     * Generates the Content for Plugin with given GET Array
     * @param {Array} get - GET Array 
     */
    getContent_GET(get) {
        return "";
    }

    /**
     * Generates the Content for Plugin with given POST Array
     * @param {Array} post - POST Array 
     */
    getContent_POST(post) {
        return "";
    }
}