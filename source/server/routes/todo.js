"use strict"
const express = require('express')
const ToDo = require("../../models/ToDo");
let router = express.Router()
const ToDoCollection = require('../../models/ToDo_Collection')
const path = require('path')

const toDoCollection = new ToDoCollection();

/**
 * send all Todos to client
 */
router.get('/',  (req, res) => {
    getTodos()
        .then(todos => {
            res.set('Content-Type', 'text/json');
            res.send(todos);
        })
})

/**
 * send main HTML ToDo Element
 */
router.get('/html/create', (req,res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/createToDo.html'))
})

/**
 * send the HTML Element, which is the body for every ToDo
 */
router.get('/html/show', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/showToDo.html'))
})

/**
 * receive a ToDo uuid and send the delete order to the ToDo_Collection
 */
router.delete('/delete/:uuid', (req, res) => {
    const { uuid } = req.params;
    toDoCollection.deleteToDo(uuid)
        .then(uuid => {
            res.set('Content-Type', 'text/json');
            res.send({uuid: uuid});
        })
}
)

/**
 * receive a body with the ToDo Descriptions, make a ToDo and send it to the ToDo_Collection to save it
 */
router.post('/create', (req, res) => {
    const { title, description, dueDate, participants, files } = req.body
    let new_todo = new ToDo(title, description, dueDate)
    toDoCollection.saveToDo(new_todo)
        .then(todo => {
            if(todo != null) {
                safeContact(todo, participants, files)
                    .then(() => res.status(200).send("created"))
            }



    })
})

/**
 * receive a uuid and the done state to set the done state of the ToDo
 */
router.put('/done', (req, res) => {
    const { uuid, done } = req.body
    const toDo = toDoCollection.getToDo(uuid)
    toDo.done = done ? 1 : 0
    toDoCollection.updateToDo(toDo).then(() => {
        res.status(200).send(true)
    })

})

/**
 * Receive a uuid and the Body with the ToDo Descriptions and update the ToDo via ToDo_Collection
 */
router.put('/update/:uuid', (req, res) => {
    const { uuid } = req.params;
    const { title, description, dueDate, participants, files } = req.body;
    const todo = toDoCollection.getToDo(parseInt(uuid))
    todo.title = title;
    todo.description = description;
    todo.participants = participants;
    todo.files = files;
    todo.dueDate = dueDate;
    console.log(todo)
    toDoCollection.updateToDo(todo)
        .then(() => {
            res.status(200).send(true)
        })
})

/**
 * This Function return the ToDos
 * @returns {[ToDo]}
 */
async function getTodos() {
    return toDoCollection.loadAllTodos();
}

/**
 * This Function call two Methods to save the connection to the Participants and files
 * @param {ToDo} todo
 * @param {Contact} participants
 * @param {File} files
 * @returns {Bool}
 */
async function safeContact(todo, participants, files) {
    if(participants !== []) {
        await toDoCollection.saveToDoParticipant(todo, participants)
    }
    if (files !== []) {
        await toDoCollection.saveToDoFiles(todo, files)
    }
    return true;

}

module.exports = router;

