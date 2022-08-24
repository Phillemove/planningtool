"use strict"

const knex = require("./knex")

async function closeDB() {
    console.log("Database is disconnecting");
    await knex.destroy();
}

async function createTables() {
    console.log("Create Tables");
    try {
        await knex.schema.hasTable('ToDo').then(exists => {
            if (!exists) {
                return knex.schema
                    .createTable('ToDo', table => {
                        table.increments('uuid')
                        table.string('title')
                            .notNullable();
                        table.string('description');
                        table.dateTime('dueDate');
                        table.boolean('done')
                            .notNullable();
                        table.integer('owner')
                            .unsigned()
                            .references('Contact.uuid')
                            .notNullable();
                        table.dateTime('createdAt')
                            .notNullable();
                        table.string('modelType');
                    })
                    .createTable('Address', table => {
                        table.increments('uuid')
                        table.string('houseNumber').notNullable();
                        table.string('street').notNullable();
                        table.integer('location')
                            .unsigned()
                            .references('Location.zip')
                            .notNullable();

                    })
                    .createTable('Location', table => {
                        table.integer('zip').notNullable();
                        table.string('location').notNullable();
                        table.primary('zip');
                    })
                    .createTable('Appointment', table => {
                        table.increments('uuid');
                        table.string('name').notNullable();
                        table.string('description');
                        table.dateTime('startDate').notNullable();
                        table.dateTime('dueDate').notNullable();
                        table.integer('owner')
                            .unsigned()
                            .references('Contact.uuid');
                        table.string('modelType');
                    })
                    .createTable('Contact', table => {
                        table.increments('uuid');
                        table.string('name').notNullable();
                        table.string('surname');
                        table.string('email');
                        table.integer('address')
                            .unsigned()
                            .references('Address.uuid');
                    })
                    // .createTable('Data', table => {
                    //     table.increments('uuid');
                    //     table.binary('dataObject').notNullable();
                    //     table.string('filename').notNullable();
                    //     table.string('description');
                    //     table.string('header').notNullable();
                    //     table.integer('fileType')
                    //         .unsigned()
                    //         .references('FileType.uuid')
                    //         .notNullable();
                    // })
                    .createTable('Data', table => {
                        table.increments('uuid');
                        table.string('filename').notNullable();
                        table.string('fileURL').notNullable();
                        table.string('filetype').notNullable();
                        table.string('modelType');
                    })
                    .createTable('FileType', table => {
                        table.increments('uuid');
                        table.string('fileType').notNullable();
                        table.boolean('embedded').notNullable();
                    })
                    .createTable('SystemID', table => {
                        table.increments('uuid');
                    })
                    .createTable('ToDo_File', table => {
                        table.increments('uuid');
                        table.integer('todo_uuid')
                            .unsigned()
                            .references('ToDo.uuid')
                            .notNullable();
                        table.integer('data_uuid')
                            .unsigned()
                            .references('Data.uuid')
                            .notNullable();
                    })
                    .createTable('Contact_File', table => {
                        table.increments('uuid');
                        table.integer('contact_uuid')
                            .unsigned()
                            .references('Contact.uuid')
                            .notNullable();
                        table.integer('data_uuid')
                            .unsigned()
                            .references('Data.uuid')
                            .notNullable();
                    })
                    .createTable('Appointment_File', table => {
                        table.increments('uuid');
                        table.integer('appointment_uuid')
                            .unsigned()
                            .references('Appointment.uuid')
                            .notNullable();
                        table.integer('data_uuid')
                            .unsigned()
                            .references('Data.uuid')
                            .notNullable();
                    })
                    .createTable('ToDo_Participants', table => {
                        table.increments('uuid');
                        table.integer('todo_uuid')
                            .unsigned()
                            .references('ToDo.uuid')
                            .notNullable();
                        table.integer('contact_uuid')
                            .unsigned()
                            .references('Contact.uuid')
                            .notNullable();
                    })
                    .createTable('Appointment_Participants', table => {
                        table.increments('uuid');
                        table.integer('contact_uuid')
                            .unsigned()
                            .references('Contact.uuid')
                            .notNullable();
                        table.integer('appointment_uuid')
                            .unsigned()
                            .references('Appointment.uuid')
                            .notNullable();
                    })
                    .createTable('Logging', table => {
                        table.increments('uuid');
                        table.string('user').notNullable();
                        table.string('change').notNullable();
                        table.timestamp('changedAt').defaultTo(knex.fn.now());
                        table.integer('todo_uuid')
                            .unsigned()
                            .references('ToDo.uuid')
                            .nullable();
                        table.integer('appointment_uuid')
                            .unsigned()
                            .references('Appointment.uuid')
                            .nullable();
                        table.integer('contact_uuid')
                            .unsigned()
                            .references('Contact.uuid')
                            .nullable();
                        table.integer('file_uuid')
                            .unsigned()
                            .references('Data.uuid')
                            .nullable();
                    })
            }
        })
    } catch (e) {
        console.error(e);
    }
}

async function getAllDatas(Table) {
    try {
        return await knex.select('*').from(Table);
    } catch (e) {
        console.error(e);
    }
}


async function getAllToDos() {
    try {
        const todos = await knex.select('*').from('ToDo')
        if (todos != null) {
            for (const todo of todos) {
                await getToDoParticipants(todo)
                await getToDoFiles(todo)
            }
        }
        return todos
    } catch (e) {
        console.error(e)
    }
}

async function getAllAppointments() {
    try {
        let appointments = await knex.select("*").from("Appointment")
        if (appointments != null) {
            for (let appointment of appointments) {
                //Just getting participants here - Files will be retrieved
                //individually - too much overhead otherwise
                await getAppointmentParticipants(appointment)
            }
        }
        return appointments
    } catch (e) {
        console.error(e)
    }
}

async function getToDoParticipants(todo) {
    todo.participants = []
    const participants = await knex.from('ToDo_Participants').where('todo_uuid', todo.uuid)
    for (const participant of participants) {
        const contact = await getContact(participant.contact_uuid)
        todo.participants.push(contact)
    }

}

async function getToDoFiles(todo) {
    todo.files = []
    const files = await knex.from('ToDo_File').where('todo_uuid', todo.uuid)
    for (const file of files) {
        const data = await getFile(file.data_uuid);
        todo.files.push(data)
    }
    return todo
}


async function writeLogging(Log) {
    const user = Log.user;
    const change = Log.change;
    const changedAt = Log.changedAt;
    const todoId = Log.todoId;
    const appointmentId = Log.appointmentId;
    const contactId = Log.contactId;
    const fileId = Log.fileId;

    try {
        return await knex('Logging').insert({
            user: user,
            change: change,
            changedAt: changedAt,
            todo_uuid: todoId,
            appointment_uuid: appointmentId,
            contact_uuid: contactId,
            file_uuid: fileId
        });
    } catch (e) {
        console.error(e);
    }

}

async function getToDoLogging(Id) {
    try {
        return await knex('Logging').where('todo_id', Id).select();
    } catch (e) {
        console.error(e);
    }
}

async function getFileLogging(Id) {
    try {
        return await knex('Logging').where('file_id', Id).select();
    } catch (e) {
        console.error(e);
    }
}

async function getContactLogging(Id) {
    try {
        return await knex('Logging').where('contact_id', Id).select();
    } catch (e) {
        console.error(e);
    }
}

async function getAppointmentLogging(Id) {
    try {
        return await knex('Logging').where('appointment_id', Id).select();
    } catch (e) {
        console.error(e);
    }
}

async function saveLocation(Location) {
    const zip = Location.zip;
    const location = Location.location;
    try {
        return await knex('Location').insert({ zip: zip, location: location });
    } catch (e) {
        console.error(e);
    }
}

async function getLocation(Zip) {
    try {
        return await knex('Location').where('zip', Zip).select();
    } catch (e) {
        console.error(e);
    }
}

async function deleteLocation(Zip) {
    try {
        return await knex('Location').where('zip', Zip).del();
    } catch (e) {
        console.error(e);
    }
}

async function saveAddress(Adress) {
    const street = Adress.street;
    const housenumber = Adress.houseNumber;
    const location_id = Adress.location;
    try {
        return await knex('Address').insert({ houseNumber: housenumber, street: street, location: location_id });
    } catch (e) {
        console.error(e);
    }
}

async function getAddress(UUID) {
    try {
        return await knex('Address').where('uuid', UUID).select();
    } catch (e) {
        console.error(e);
    }
}

async function getAddressbyStreet(Street, Housenumber) {
    try {
        return await knex('Address').where({ street: Street, houseNumber: Housenumber }).select();
    } catch (e) {
        console.error(e);
    }
}

async function deleteAddress(Street, Housenumber) {
    try {
        return await knex('Address').where({ street: Street, houseNumber: Housenumber }).del();
    } catch (e) {
        console.error(e);
    }
}

async function saveContact(Contact) {
    const name = Contact.name;
    const surname = Contact.surname;
    const email = Contact.email;
    const address = Contact.address
    try {
        return await knex('Contact').insert({
            name: name,
            surname: surname,
            email: email,
            address: address,
        });
    } catch (e) {
        console.error(e);
    }
}

async function getContact(UUID) {
    try {
        return await knex('Contact').where('uuid', UUID).select();
    } catch (e) {
        console.error(e);
    }
}

async function updateContact(Contact) {
    const uuid = Contact.uuid;
    try {
        return await knex('Contact').where('uuid', uuid).update({
            name: Contact.name,
            surname: Contact.surname,
            email: Contact.email,
            address: Contact.address,
        });
    } catch (e) {
        console.error(e);
    }
}

async function deleteContact(UUID) {
    try {
        return await knex('Contact').where('uuid', UUID).del();
    } catch (e) {
        console.error(e);
    }
}

async function getContactFiles(contact) {
    contact.files = [];
    const files = await knex.from('Contact_File').where('contact_uuid', contact.uuid);
    for (const file of files) {
        const data = await getFile(file.data_uuid);
        contact.files.push(data);
    }
    return contact;
}

async function saveContactFiles(contactUUID, fileUUIDs) {
    const UUIDs = [];
    await knex('Contact_File').where({ contact_uuid: contactUUID }).del();
    for (const data_uuid of fileUUIDs) {
        try {
            const uuid = await knex('Contact_File').insert({
                contact_uuid: contactUUID,
                data_uuid: data_uuid
            });
            UUIDs.push(uuid);
        } catch (e) {
            console.error(e);
        }
    }
    return UUIDs;
}

async function deleteContactFiles(contactUUID) {
    try {
        return await knex('Contact_File').where({ contact_uuid: contactUUID }).del();
    } catch (e) {
        console.error(e);
    }
}

// async function saveFile(File) {
//     const data = File.content;
async function saveFile(File) {
    console.log(File)
    try {
        return await knex('Data').insert({
            filename: File.originalname,
            fileURL: File.path,
            filetype: File.mimetype,
            modelType: "File"
        });
    } catch (e) {
        console.error(e);
    }
}

async function getAllFiles() {
    try {
        const allFiles = await knex.select('*').from('Data')
        // if (allFiles != null) {
        //     for (const file of allFiles) {
        //         await getToDoParticipants(todo)
        //         await getToDoFiles(todo)
        //     }
        // }
        return allFiles
    } catch (e) {
        console.error(e)
    }
}

async function getFile(Id) {
    try {
        return await knex('Data').where('uuid', Id).select();
    } catch (e) {
        console.error(e);
    }
}

async function getFilesById(Id) {
    try {
        let dataobj = await knex('Data').where('uuid', Id).select();
        return dataobj
    } catch (e) {
        console.error(e);
    }
}

async function deleteFile(Id) {
    try {
        await knex('ToDo_File').where('data_uuid', Id).del();
        await knex('Contact_File').where('data_uuid', Id).del();
        await knex('Appointment_File').where('data_uuid', Id).del();
        return await knex('Data').where('uuid', Id).del();
    } catch (e) {
        console.error(e);
    }
}

async function saveAppointment(appointment) {
    const name = appointment.name;
    const description = appointment.description;
    const startDate = appointment.from;
    const dueDate = appointment.to;
    const owner = appointment.owner;
    const modelType = "Appointment";
    try {
        return await knex('Appointment').insert({
            name: name,
            description: description,
            startDate: startDate,
            dueDate: dueDate,
            Owner: owner,
            modelType: modelType
        });
    } catch (e) {
        console.error(e);
    }
}

async function getAppointment(UUID, Name, Owner) {

    try {
        if (UUID != null) {
            return await knex('Appointment').where('uuid', UUID).select();
        } else if (Name != null) {
            return await knex('Appointment').where('name', Name).select();
        } else if (Owner != null) {
            return await knex('Appointment').where('owner', Owner).select();
        }
    } catch (e) {
        console.error(e);
    }
}

async function updateAppointment(appointment) {
    const uuid = appointment.uuid;
    try {
        return await knex('Appointment').where('uuid', uuid).update({
            name: appointment.name,
            description: appointment.description,
            startDate: appointment.from,
            dueDate: appointment.to,
            owner: appointment.owner
        });
    } catch (e) {
        console.error(e);
    }
}

async function deleteAppointment(appointment) {
    let uuid = appointment.uuid;
    try {
        await knex("Appointment_File").where({ appointment_uuid: uuid }).del();
        await knex("Appointment_Participants").where({ appointment_uuid: uuid }).del();
        return await knex('Appointment').where('uuid', uuid).del();
    } catch (e) {
        console.error(e);
    }
}

async function saveAppointmentParticipants(appointment) {
    let uuids = []
    await knex("Appointment_Participants").where({ appointment_uuid: appointment.uuid }).del();
    for (let participant of appointment.participants) {
        try {
            const uuid = await knex("Appointment_Participants").insert({
                appointment_uuid: appointment.uuid,
                contact_uuid: participant
            })
            uuids.push(uuid)
        } catch (e) {
            console.error(e);
        }
    }
    return uuids
}

async function saveAppointmentFiles(appointment) {
    let uuids = []
    await knex("Appointment_File").where({ appointment_uuid: appointment.uuid }).del();
    for (let file of appointment.files) {
        try {
            const uuid = await knex("Appointment_File").insert({
                appointment_uuid: appointment.uuid,
                data_uuid: file
            })
            uuids.push(uuid)
        } catch (e) {
            console.error(e);
        }
    }
    return uuids
}

async function getAppointmentParticipants(appointment) {
    appointment.participants = []
    let participants = await knex.from("Appointment_Participants").where("appointment_uuid", appointment.uuid)
    for (let participant of participants) {
        let contact = await getContact(participant.contact_uuid)
        appointment.participants.push(contact)
    }
}

async function getAppointmentFiles(appointment) {
    appointment.files = []
    let files = await knex.from("Appointment_File").where("appointment_uuid", appointment.uuid)
    for (let file of files) {
        let f = await getFile(file.data_uuid)
        appointment.files.push(f)
    }
}

async function saveToDo(ToDo) {
    const title = ToDo.title;
    const description = ToDo.description;
    const dueDate = ToDo.dueDate;
    const done = ToDo.done;
    const createdAt = ToDo.createdAt.getTime() / 1000;
    const owner = ToDo.owner;
    const modelType = "ToDo";
    try {
        return await knex('ToDo').insert({
            title: title,
            description: description,
            dueDate: dueDate,
            done: done,
            owner: owner,
            createdAt: createdAt,
            modelType: modelType
        })
    } catch (e) {
        console.error(e);
    }
}

async function saveToDoParticipant(todo, participantUUIDs) {
    const UUIDs = []
    await knex('ToDo_Participants').where({ todo_uuid: todo.uuid }).del();
    for (const contact_uuid of participantUUIDs) {
        try {
            const uuid = await knex('ToDo_Participants').insert({
                todo_uuid: todo.uuid,
                contact_uuid: contact_uuid
            })
            UUIDs.push(uuid)
        } catch (e) {
            console.error(e);
        }
    }
    return UUIDs
}

async function saveToDoFiles(todo, fileUUIDs) {
    const UUIDs = []
    await knex('ToDo_File').where({ todo_uuid: todo.uuid }).del();
    for (const data_uuid of fileUUIDs) {
        try {
            const uuid = await knex('ToDo_File').insert({
                todo_uuid: todo.uuid,
                data_uuid: data_uuid
            })
            UUIDs.push(uuid)
        } catch (e) {
            console.error(e);
        }
    }
    return UUIDs
}

async function getToDo(UUID) {
    try {
        const todo = await knex('ToDo').where('uuid', UUID).select();
        if (todo != null) {
            await getToDoParticipants(todo)
            await getToDoFiles(todo)
        }
        return todo
    } catch (e) {
        console.error(e);
    }
}

async function updateToDo(ToDo) {
    const uuid = ToDo.uuid;
    try {
        await saveToDoParticipant(ToDo, ToDo.participants);
        await saveToDoFiles(ToDo, ToDo.files);
        return await knex('ToDo').where('uuid', uuid).update({
            title: ToDo.title,
            description: ToDo.description,
            dueDate: ToDo.dueDate,
            done: ToDo.done,
            owner: ToDo.owner,
            currentStatus: ToDo.currentStatus
        });
    } catch (e) {
        console.error(e);
    }
}

async function deleteToDo(todo) {
    try {
        await knex('ToDo_Participants').where({ todo_uuid: todo.uuid }).del();
        await knex('ToDo_File').where({ todo_uuid: todo.uuid }).del();
        return await knex('ToDo').where({ uuid: todo.uuid }).del();

    } catch (e) {
        console.error(e);
    }
}

// System

async function saveStatus(Status) {
    try {
        return await knex('Status').insert({ name: Status });
    } catch (e) {
        console.error(e);
    }
}

async function getStatus(Name) {
    try {
        return await knex('Status').where('name', Name).select();
    } catch (e) {
        console.error(e);
    }
}

async function deleteStatus(Name) {
    try {
        return await knex('Status').where('name', Name).del();
    } catch (e) {
        console.error(e);
    }
}

async function saveSystemID(Id) {
    try {
        return await knex('SystemId').insert({ uuid: Id });
    } catch (e) {
        console.error(e);
    }
}

async function getSystemID() {
    try {
        return await knex.select("*").from('SystemID');
    } catch (e) {
        console.error(e);
    }
}

async function deleteSystemID(Id) {
    try {
        return await knex('SystemID').where('uuid', Id).del();
    } catch (e) {
        console.error(e);
    }
}

async function showAllTables() {
    try {
        return await knex('sqlite_master').where('type', 'table')
    } catch (e) {
        console.error(e);
    }
}

async function getAllLogs() {
    try {
        return await knex.select("*").from("Logging")
    } catch (e) {
        console.error(e);
    }
}

async function getAppointmentLogs(id) {
    try {
        return await knex.from("Logging").where('appointment_uuid', id)
    } catch (e) {
        console.error(e);
    }
}



module.exports = {
    closeDB,
    getAllDatas,
    saveContact,
    getContact,
    updateContact,
    deleteContact,
    saveLocation,
    getLocation,
    deleteLocation,
    saveFile,
    getFile,
    deleteFile,
    saveAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    saveToDo,
    getToDo,
    updateToDo,
    deleteToDo,
    saveAddress,
    getAddress,
    deleteAddress,
    saveStatus,
    getStatus,
    deleteStatus,
    saveSystemID,
    getSystemID,
    deleteSystemID,
    showAllTables,
    createTables,
    writeLogging,
    getToDoLogging,
    getFileLogging,
    getAppointmentLogging,
    getContactLogging,
    getAllToDos,
    saveToDoParticipant,
    saveToDoFiles,
    saveAppointmentParticipants,
    saveAppointmentFiles,
    getAppointmentParticipants,
    getAppointmentFiles,
    getAllAppointments,
    getAddressbyStreet,
    getContactFiles,
    saveContactFiles,
    deleteContactFiles,
    getAllLogs,
    getAppointmentLogs,
    getAllFiles,
    getFilesById
}
