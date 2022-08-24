// Logging types defines the differnt categories of Methods which can be logged. Depending on the category
// the logger will uses diffrent operation modes

// true and false define if a category shall be logged
const loggingTypes = {
    GET: ["GET", false],
    SAVE: ["SAVE", true],
    UPDATE: ["UPDATE", true],
    DELETE: ["DELETE", true],
    UNASSIGNED: ["UNASSIGNED", true]
}

// Each Object type that shall be used to be logged has to be defined here.
// This is to identify Objects are being used as parameter
const modelsToLog = new Map()
modelsToLog.set("Adress", require('../models/Adress'));
modelsToLog.set("Appointment", require('../models/Appointment'));
modelsToLog.set("Contact", require('../models/Contact'));
modelsToLog.set("File", require('../models/File'));
modelsToLog.set("Location", require('../models/Location'));
modelsToLog.set("ToDo", require('../models/ToDo'));


module.exports = {
    loggingTypes,
    modelsToLog
}