"use strict"
const ToDo = require('../models/ToDo.js')
const Repository = require('../Repository')
const {getToDo} = require("../Database/db_operations"); //todo

module.exports = class ToDos {
    #todos = [];

    constructor() {
        this.loadAllTodos().then(todos => {
            this.#todos = todos
        })
    }

    get todos() {
        return this.#todos;
    }

    createToDo(title, description, dueDate, owner) {
        let new_todo = new ToDo(title, description, dueDate = null, owner);
        this.saveToDo(new_todo)
    }

    async loadAllTodos() {
        return await Repository.getAllToDos();
    }

    /**
     *
     * @param {Int} id
     * @returns {ToDo|null}
     */
    getToDo(id) {
        let found_todo = null
        let found = false
        for (let i = 0; !found && i < this.#todos.length; i++) {
            if (this.#todos[i].uuid === id) {
                found_todo = this.#todos[i];
                found = true;
            }
        }
        return found_todo;
    }

    async updateToDo(todo) {
        let inserted;
        await Repository.updateToDo(todo)
            .then(check => {
                if (check) {
                    this.loadAllTodos()
                        .then(todos => {
                            this.#todos = todos
                            inserted = true
                        })
                } else {
                    console.log('updateToDo check failed')
                    inserted = false;
                }
            })
        return inserted;
    }

    /**
     *
     * @param {ToDo} toDo
     */
    async saveToDo(toDo) {
        const id = await Repository.saveToDo(toDo);
        if (id != null) {
            this.#todos = await this.loadAllTodos()
            return this.getToDo(id[0])
        } else {
            return null;
        }
    }

    async saveToDoParticipant(todo, participantUUIDs) {
        return await Repository.saveToDoParticipant(todo, participantUUIDs)
    }

    async saveToDoFiles(todo, filesUUIDs) {
        return await Repository.saveToDoFiles(todo, filesUUIDs)
    }

    /**
     *
     * @param {Int} uuid
     */
    async deleteToDo(uuid) {
        const todo = this.getToDo(parseInt(uuid))
        const id = await Repository.deleteToDo(todo)

        if (id != null) {
            this.#todos = await this.loadAllTodos()
            return true;
        } else {
            return false;
        }
    }
}