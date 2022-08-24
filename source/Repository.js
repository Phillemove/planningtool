"use strict";
const db = require("./Database/db_operations");
const logger = require("./utils/logger");
const {createTables} = require("./Database/db_operations");
const {loggingTypes} = require("./utils/logginTypes");

class Repository {

    /*
    Bei dem folgenden handelt es sich um eine Beispielhafte Implementierung der Schnittstelle, wenn Teilnehmer eingefügt wurden.
    Auch hier sind natürlich noch eineige Arbeiten dran vorzunehmen, da die exakte Benennung und gegebenenfalls auftretende
    Änderungen erst mit der wirklichen Implementierung und Umsetzung stehen würde.
    Und dies lässt sich auf die anderen Methoden ummünzen, bei denen Teilnehmer mit Involviert sind.
     */
    async saveToDo(toDo) {
        /*
        if (todo.participants !== null) {
            for (const participant of todo.participants) {
                fetch('Schnittstelle'), {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        contact: participant.email,
                        type: 'ToDo',
                        object: {
                            title:title,
                            description:description,
                            dueDate:dueDate,
                            participants: partSelected,
                            files: fileSelected
                        }
                    })
                }
            }
        }
         */

        return await db.saveToDo(toDo);
    }

    async saveAppointment(Appointment) {
        return await db.saveAppointment(Appointment);
    }

    async updateAppointment(Appointment) {
        return await db.updateAppointment(Appointment);
    }

    async deleteAppointment(uuid) {
        return await db.deleteAppointment(uuid);
    }

    async saveAppointmentParticipants(appointment) {
        return await db.saveAppointmentParticipants(appointment);
    }

    async saveAppointmentFiles(appointment) {
        return await db.saveAppointmentFiles(appointment);
    }

    async getAppointmentFiles(appointment) {
        return await db.getAppointmentFiles(appointment);
    }

    async deleteToDo(todo) {
        return await db.deleteToDo(todo);
    }

    async deleteContact(uuid) {
        return await db.deleteContact(uuid);
    }

    async getAllDatas(tablename) {
        return await db.getAllDatas(tablename);
    }

    async getAllToDos() {
        return await db.getAllToDos();
    }

    async getAllAppointments() {
        return await db.getAllAppointments();
    }

    async getAllContacts() {
        return await db.getAllDatas('Contact');
    }

    async saveToDoParticipant(todo, participantUUIDs) {
        return await db.saveToDoParticipant(todo, participantUUIDs);
    }

    async saveToDoFiles(todo, filesUUIDs) {
        return await db.saveToDoFiles(todo, filesUUIDs);
    }

    async saveContactFiles(contactUUID, fileUUIDs) {
        return await db.saveContactFiles(contactUUID, fileUUIDs);
    }

    async getContactFiles(contact) {
        return await db.getContactFiles(contact);
    }

    async deleteContactFiles(contactUUID) {
        return await db.deleteContactFiles(contactUUID);
    }

    async updateToDo(todo) {
        return await db.updateToDo(todo);
    }

    async updateContact(contact) {
        return await db.updateContact(contact);
    }

    async saveAddress(address) {
        await db.saveAddress(address);
    }

    async saveLocation(location) {
        await db.saveLocation(location);
    }

    async showAllTables() {
        await db.showAllTables();
    }

    async getAddress(UUID) {
        return await db.getAddress(UUID);
    }

    async getAdressbyStreet(address) {
        return await db.getAddressbyStreet(address.street, address.houseNumber);
    }

    async getLocation(zip) {
        return await db.getLocation(zip);
    }

    async saveContact(Contact) {
        return await db.saveContact(Contact);
    }

    async getAllLogs() {
        return await db.getAllLogs();
    }

    async getAppointmentLogs(id) {
        return await db.getAppointmentLogs(id);
    }

    async saveFile(File){
        return await db.saveFile(File)
    }

    async getAllFiles(){
        return await db.getAllFiles()
    }

    async deleteFileById(Id){
        return await db.deleteFile(Id)
    }

    async getFilesById(Id){
        return await db.getFilesById(Id)
    }
}


// All functions will be mapped to there type to optimize logging. If a function is not mapped to its type,
// it will be automaticly assigned to the "unspecified type". Logging will still work, but depending on what
// arguments are given and what is returned, the output might not perfectly fit

const funcMapping = new Map();

// GET
funcMapping.set(Repository.prototype.getAppointmentFiles, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAllDatas, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAllToDos, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAllContacts, loggingTypes.GET);
funcMapping.set(Repository.prototype.getContactFiles, loggingTypes.GET);
funcMapping.set(Repository.prototype.showAllTables, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAddress, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAdressbyStreet, loggingTypes.GET);
funcMapping.set(Repository.prototype.getLocation, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAllAppointments, loggingTypes.GET);
funcMapping.set(Repository.prototype.getFilesById, loggingTypes.GET);
funcMapping.set(Repository.prototype.getAllFiles, loggingTypes.GET);


//SAVE
funcMapping.set(Repository.prototype.saveToDo, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveAppointment, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveAppointmentParticipants, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveAppointmentFiles, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveToDoParticipant, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveToDoFiles, loggingTypes.SAVE,);
funcMapping.set(Repository.prototype.saveContactFiles, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveAddress, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveLocation, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveContact, loggingTypes.SAVE);
funcMapping.set(Repository.prototype.saveFile, loggingTypes.SAVE);

//UPDATE
funcMapping.set(Repository.prototype.updateAppointment, loggingTypes.UPDATE);
funcMapping.set(Repository.prototype.updateToDo, loggingTypes.UPDATE);
funcMapping.set(Repository.prototype.updateContact, loggingTypes.UPDATE);

//DELETE
funcMapping.set(Repository.prototype.deleteAppointment, loggingTypes.DELETE);
funcMapping.set(Repository.prototype.deleteToDo, loggingTypes.DELETE);
funcMapping.set(Repository.prototype.deleteContact, loggingTypes.DELETE);
funcMapping.set(Repository.prototype.deleteContactFiles, loggingTypes.DELETE);
funcMapping.set(Repository.prototype.deleteFileById, loggingTypes.DELETE);

// Add Methods here which shall not be logged. E.g. Functioncalls the repos does itself
const doNotLog = [
    Repository.prototype.getAllLogs,
    Repository.prototype.getAppointmentLogs
]


Object.getOwnPropertyNames(Repository.prototype)
    .forEach(name => {
        const func = Repository.prototype[name];

        if (!doNotLog.includes(func)){

            // checking loggingTypes - if no type is assigned function will be assigned to "UNASSIGNED".
            if (!funcMapping.has(func)) {
                funcMapping.set(func, loggingTypes.UNASSIGNED);
            }
            // function will only be wrapped if logging is enabled.
            if (funcMapping.get(func)[1]) {
                // Insert additional functionallity which shall be bound to the function itself inside the returned object. This code will be available inside the function - object at runtime.
                Repository.prototype[name] = async function (...args) {
                    // calls the original methode
                    const returnValue = await func.apply(this, args);

                    // Put any additional logic here and it will be applied -> magic
                    // Logging
                    const logObj = logger(func, returnValue, funcMapping.get(func)[0], args)
                    if(logObj.todoId != null || logObj.fileId || logObj.appointmentId != null || logObj.contactId != null || name == "saveContact" || name == "updateContact" || typeof returnValue == 'number'){
                        db.writeLogging(logObj).then(() => {
                            //console.log(`Function "${name}()" was successfully logged and saved to Database`)
                        }).catch(e => {
                            console.log(`Function "${name}()" could not be logged and saved to Database. ${func}`);
                            console.log(e);
                        });
                    }

                    return returnValue;
                };
            }
        }
    });


// Repository acts like a singelton due to the way export - statements work in javascript / nodejs
module.exports = new Repository();
