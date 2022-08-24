"use strict";

const Appointment = require("./Appointment");
const Repository = require("../Repository");

module.exports = class Appointment_Collection
{
    #appointments = [];
    #owner = 1; // TODO: need to save this somewhere else and retrieve it here

    get appointments()
    {
        return this.#appointments;
    }

    constructor()
    {
        this.loadAllAppointments();
    }

    /**
     * @name loadAllAppointments
     * @description Loads all Appointments from DB and saves them in the #appointments array
     */
    async loadAllAppointments()
    {
        if (this.#appointments.length > 0)
        {
            this.#appointments = [];
        }
       const allAppointments = await Repository.getAllAppointments()
       this.#appointments = allAppointments;
    }

    /**
     * @name createAppointment
     * @description Creates an Appointment and saves it in Database
     * @param {String} name
     * @param {String} description
     * @param {Date} from
     * @param {Date} to
     * @param {[Contact]}participants
     * @param {[File]}files
     */
    createAppointment(name, description, from, to, participants, files)
    {
        let newAppointment = new Appointment(
            name,
            description,
            from,
            to,
            participants,
            files
        );
        this.saveAppointment(newAppointment);
    }

    /**
     * @name saveAppointment
     * @description Saves given Appointment in Database also updates Files and Participants
     * @param {Appointment} appointment
     */
    async saveAppointment(appointment)
    {
        const id = await Repository.saveAppointment(appointment);
        if (id != null)
        {
            appointment.uuid = id[0];
            await Repository.saveAppointmentFiles(appointment);
            await Repository.saveAppointmentParticipants(appointment);
            await this.loadAllAppointments();
            return id[0];
        } else
        {
            return null;
        }
    }

    /**
     * @name getAppointment
     * @description Gives back an Appointment with given ID from collection also fetches Files for this Appointment
     * @param {Integer} uuid - ID of Appointment to get
     * @returns {Appointment} - gives back the Appointment or null if not found
     */
    async getAppointment(uuid)
    {
        let appointment = null;
        for (let i = 0; appointment == null && i < this.#appointments.length; i++)
        {
            if (this.#appointments[i].uuid == uuid)
                appointment = this.#appointments[i];
        }
        // Get Files
        if (appointment != null)
        {
            await Repository.getAppointmentFiles(appointment);
            return appointment;
        } else
        {
            return null;
        }
    }

    /**
     * Updates an Appointment in Database
     * @param {Appointment} appointment - the Appointment in its desired state to be saved
     */
    async updateAppointment(appointment)
    {
        const id = await Repository.updateAppointment(appointment);
        if (id != null)
        {
            await Repository.saveAppointmentFiles(appointment);
            await Repository.saveAppointmentParticipants(appointment);
            await this.loadAllAppointments();
            return id;
        } else
        {
            return null;
        }
    }

    /**
     * Deletes an Appointment from DB, also deleting Files and Participants from it
     * @param {Integer} uuid - ID of Appointment to be deleted
     */
    async deleteAppointment(uuid)
    {
        const appointment = await this.getAppointment(uuid);
        await Repository.deleteAppointment(appointment)
        await this.loadAllAppointments();
    }
};
