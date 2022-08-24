const appointment_model = require('../models/Appointment');
const contact_model = require('../models/Contact');
const toDo_model = require('../models/ToDo');
const file_model = require('../models/File');
const {loggingTypes, modelsToLog} = require("./logginTypes")


function log() {
    // returns a function that returns an object. When this function is then called the object is returned
    return function decorator(funcToLog, returnValue, funcType, args) {

        // create prototype for object that later will be passed to database
        const descriptor = function (user, funcToLog, changedAt, funcType, returnValue, argus) {
            this.user = user; // some user id
            this.change = getChanges(funcToLog, funcType, returnValue, args); //
            this.changedAt = changedAt; // date when changes occoured
            this.appointmentId = getUuid(appointment_model, argus, "Appointment");
            this.todoId = getUuid(toDo_model, argus, "ToDo");
            this.contactId = getUuid(contact_model, argus, "Contact");
            this.fileId = getUuid(file_model, argus, "Field");
        };


        // THIS SWITCHCASE IS NOT NESCESSARY AS OF NOW -> but: provids more modularity and better logginghandling when implementing Servercommunication
        // contains all logging Data about the function being called -> name of function, usedArguments and returnValue
        function getChanges(func, funcType, returnValue, args) {
            let changes = null;
            switch (funcType) {
                case loggingTypes.GET[0]:
                    changes = {
                        funcName: func.name,
                        funcType: funcType,
                        parameter: getDataFromArgs(args),
                        returnValue: returnValue
                    }
                    break;
                case loggingTypes.SAVE[0]:
                    changes = {
                        funcName: func.name,
                        funcType: funcType,
                        parameter: getDataFromArgs(args),
                        returnValue: returnValue
                    }
                    break;
                case loggingTypes.UPDATE[0]:
                    changes = {
                        funcName: func.name,
                        funcType: funcType,
                        parameter: getDataFromArgs(args),
                        returnValue: returnValue
                    }
                    break;
                case loggingTypes.DELETE[0]:
                    changes = {
                        funcName: func.name,
                        funcType: funcType,
                        parameter: getDataFromArgs(args),
                        returnValue: returnValue
                    }
                    break;
                case loggingTypes.UNASSIGNED[0]:
                    changes = {
                        funcName: func.name,
                        funcType: funcType,
                        parameter: getDataFromArgs(args),
                        returnValue: returnValue
                    }
            }
            return changes;
        }

        // always retrieves uuid from first given argument
        function getUuid(model_type, args, type_def) {
            let uuid = null;
            if (args[0] instanceof model_type) {
                uuid = parseInt(args[0].uuid);
                if(args[0] instanceof contact_model){
                    uuid = returnValue;
                }
            } else if (typeof args[0] == "number") {
                uuid = args[0]
            } else if(args[0].modelType == type_def){
                uuid = args[0].uuid
            } else if(args[0].modelType == type_def && uuid == null){
                uuid = returnValue;
            }
            return uuid;
        }


        // can contain a Object, a list of Objects, or a list of primiteve values (like numbers)
        function getDataFromArgs(args) {
            let retreivedData = {};
            let argCount = 0;
            args.forEach(singleData => {
                if (typeof singleData === 'object') {
                    // if object is passed as arguments it will be saved in a wrapper - object, which contains the
                    // given args in retreivedData.1 or retreivedData.2. uuids will alway be added to retreivedData.uuid
                    retreivedData[argCount] = getAllDataFromObj(singleData);
                    if (argCount === 0) {
                        retreivedData.uuid = retreivedData[argCount].uuid;
                    }
                    retreivedData.uuid = retreivedData[argCount].uuid;
                } else if (typeof singleData === 'number') {
                    if (argCount === 0) {
                        retreivedData.uuid = singleData;
                    } else {
                        retreivedData.uuidOfSecParam = singleData;
                    }
                }
                argCount++;
            })
            return retreivedData;
        }

        // iterates dynamically through all getter Functions of an given object to retrieve all values contained.
        // Only calls methods which use the JS get - Syntax. By definition they can not be called with an argument.
        function getAllDataFromObj(dataObj) {
            // gets names of all functions defined in the prototype of an Object using the objects prototype. These
            // names are required to iterate dynamicly through all obj - methods
            let newDataObj = {}

            // Object.getPrototypeOf(dataObj) can be used as well to log inherited atributes as well
            Object.getOwnPropertyNames(Object.getPrototypeOf(dataObj))
                .forEach(name => {
                    if (name != "constructor") {
                        const func = dataObj[name];
                        try {
                            // JSON.stringy might try to acces attribute that should not be accessd
                            const tryStringy = JSON.stringify(func)
                            if (tryStringy != null) {
                                newDataObj[name] = func;
                            } else {
                                throw "containsPrivateData"
                            }
                        } catch (containsPrivateData) {
                            //console.log("Skipped Method that contains private values that should stay private");
                        }
                    }
                })
            return newDataObj;
        }

        const description = new descriptor("Local User", funcToLog, new Date().toLocaleString(), funcType, returnValue, args)
        description.change = JSON.stringify(description.change);
        return description;
    }
}
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

module.exports = log();