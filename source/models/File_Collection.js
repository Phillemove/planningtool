"use strict"
const Repository = require('../Repository');
const File = require('../models/File.js')

const path = require('path')
const fs = require('fs')

module.exports = class Filecollection {

    #files = [];
    constructor() {
        this.loadAllFiles().then(files => {
            this.#files = files;
        })
    }

    /**
     * 
     * @returns 
     */
    async loadAllFiles() {
        return await Repository.getAllDatas('Data');
    }

    get files() {
        return this.#files;
    }

    /**
     * 
     * @returns 
     */
    async loadAllTypes() {
        return await Repository.getAllDatas('FileType');
    }
    /**
     * 
     * @param {*} file 
     * @returns 
     */
    async safeFiles(file) {
        console.log("async safeFiles in File_Collection")
        return await Repository.safeFile('file')
    }

    /**
     * 
     * @returns 
     */
    async getFilesFromDB() {
        return await Repository.getAllDatas('Data')
    }

    /**
     * 
     * @returns 
     */
    async getAllFileNames() {
        return Repository.getAllFiles()
    }

    /**
     * 
     * @param {*} fileIndexFromView 
     * @returns 
     */
    async getFileIndexFromView(fileIndexFromView) {
        let fileIndex = fileIndexFromView
        console.log("getFileIndexFromView" + " " + fileIndex)
        return fileIndex
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    deleteFiles(id) {
        let filePath = path.join(__dirname, '../', id)
        fs.unlink(filePath, (e) => {
            console.log(e)
        })
        return true
    }

    /**
     * 
     * @param {*} Id 
     * @returns 
     */
    async deleteFileById(Id) {
        return Repository.deleteFileById(Id)
    }

    /**
     * 
     * @param {*} Id 
     * @returns 
     */
    async getFilesByID(Id) {
        return Repository.getFilesById(Id)
    }
}