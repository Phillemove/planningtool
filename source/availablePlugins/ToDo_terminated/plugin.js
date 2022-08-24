const path = require("path");
const ToDoCollection = require("../../models/ToDo_Collection");
const toDoCollection = new ToDoCollection()

module.exports = class plugin {

    // Testing Plugin
    name = "ToDo Terminated";
    description = "Zeigt die terminierten ToDos an.";
    folder = "ToDo_terminated";
    pathPrefix = "ToDoTerminated";
    pathes = {
        '/':this.getSiteData,
        '/todos/':this.getTimedTodos,
        '/html/todo':this.getToDoHtml
    }
    jsFiles = ["index.js"]
    description_image = 'screen_example.png'


    constructor() {
        this.init()
    }

    init() {
        return true; // no initialisation needed
    }

    getSiteData(req, res) {
        res.set('Content-Type', 'text/html');
        res.sendFile(path.join(__dirname, './html/surrounding.html'));
    }


    getTimedTodos(req, res) {
        getTodosFromDB()
            .then(todos => {
                res.set('Content-Type', 'text/json')
                res.status(200).send(todos)
            })

    }

    getToDoHtml(req, res) {
        res.set('Content-Type', 'text/html');
        res.sendFile(path.join(__dirname, './html/showToDo.html'));
    }



    toClient() {
        return {
            name : this.name,
            description: this.description,
            folder: this.folder,
            pathPrefix: this.pathPrefix,
            jsFiles: this.jsFiles,
            description_image: this.description_image
        }
    }
}

async function getTodosFromDB() {
    const todo = await toDoCollection.loadAllTodos()
    return todo.filter(todo => todo.dueDate != null)
}