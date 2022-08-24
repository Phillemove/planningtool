"use strict";

const Log = require("./Log");
const Repository = require("../Repository");

module.exports = class Log_Collection
{
    #logs = [];
    static #dateFormat = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    get logs() { return this.#logs; }

    constructor()
    {
        this.loadAllLogs();
    }

    /**
     * @name loadAllLogs
     * @description Loads all Logs from Repository and saves them in Collection
     */
    async loadAllLogs()
    {
        if (this.#logs.length > 0)
        {
            this.#logs = [];
        }
        let logs = await Repository.getAllLogs();



            this.#logs = logs;


    }

    /**
     * @name prepareLogs
     * @description Sorts and change DateTime-Format in Log Array
     * @param {Array} logs - Return of Repository get Logs
     */
    static prepareLogs(logs)
    {
        logs.sort((a, b) => { return b.changedAt - a.changedAt; });
        logs.forEach(log =>
        {
            log.changedAt = new Date(log.changedAt).toLocaleString("de-DE", this.#dateFormat);
        });
    }

    /**
     * @name getAppointmentLogs
     * @description Gives back alle Logs for gien Appointment id
     * @param {Integer} id 
     * @returns {Array} All Logs for Appointment with given ID
     */
    async getAppointmentLogs(id)
    {
        let logs = await Repository.getAppointmentLogs(id);
        Log_Collection.prepareLogs(logs);
        return logs;
    }
};