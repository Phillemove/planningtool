"use strict"

//plugin needs to be the folder Name

function ToDoTerminatedinit() {
    const navBtn = document.getElementById(`ToDo_terminated_nav`)
    navBtn.addEventListener('click', () => {
        fetch(`http://localhost:8023/plugin/ToDoTerminated/`)
            .then(response => response.text())
            .then(html => {
                const centerDiv = document.getElementById("content");
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html')
                const responseHTML = doc.body.firstChild;
                centerDiv.innerHTML = ""
                centerDiv.append(responseHTML)
                ToDoTerminatedgetToDoShowHTML()
            })
    })
}

function ToDoTerminatedgetToDoShowHTML() {
    fetch(`http://localhost:8023/plugin/ToDoTerminated/html/todo`)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const showHTML = doc.body.firstChild;
            ToDoTerminatedgetAllTimedToDos(showHTML);
        })
}

function ToDoTerminatedgetAllTimedToDos(showHTML) {
    fetch(`http://localhost:8023/plugin/ToDoTerminated/todos`)
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                const givenHTML = showHTML.cloneNode(true)
                ToDoTerminatedcreateHtmlToDo(element, givenHTML)
            })
        })
}

function ToDoTerminateddeleteToDo(uuid) {
    fetch('http://localhost:8023/todo/delete/' + uuid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(() => {
            ToDoTerminatedtodoCleanup();
        })
}

function ToDoTerminatedcreateHtmlToDo(todo, showHTML) {
    const title = showHTML.getElementsByClassName('todo-title')[0]
    const description = showHTML.getElementsByClassName('todo-description')[0]
    const deleteBtn = showHTML.getElementsByClassName('delete-Btn')[0]
    deleteBtn.addEventListener('click', () => ToDoTerminateddeleteToDo(todo.uuid))
    title.innerText = todo.title
    description.innerText = todo.description
    showHTML = showDueDate(todo, showHTML);

    const checkedBtn = showHTML.getElementsByClassName('todo-checked-btn')[0]
    const uncheckedBtn = showHTML.getElementsByClassName('todo-unchecked-btn')[0]
    checkedBtn.addEventListener('click', () => {
        ToDoTerminatedchangeDone(todo.uuid, false)
    })
    uncheckedBtn.addEventListener('click', () => {
        ToDoTerminatedchangeDone(todo.uuid, true)
    })
    if (todo.participants.length !== 0) {
        const partList = showHTML.getElementsByClassName('todo-participants')[0];
        partList.innerHTML = "";
        for (const participant of todo.participants){
            const li = document.createElement('li');
            li.innerText = participant[0].name;
            partList.append(li);
        }
    } else {
        const partList = showHTML.getElementsByClassName('todo-participants')[0];
        partList.classList.add('d-none');
    }
    if (todo.files.length !== 0) {
        const fileList = showHTML.getElementsByClassName('todo-files')[0];
        fileList.innerHTML = "";
        for (const file of todo.files) {
            const li = document.createElement('li');
            li.innerText = file[0].filename;
            fileList.append(li);
        }
    }

    const divider = document.createElement('div')
    divider.classList.add('p-2', 'mx-4', 'border-black-25', 'border-bottom');
    const unchecked = document.getElementById('unchecked')
    const checked = document.getElementById('checked')
    if (!todo.done) {
        uncheckedBtn.classList.remove('d-none')
        checkedBtn.classList.add('d-none')
        unchecked.append(showHTML)
        unchecked.append(divider)
    } else {
        uncheckedBtn.classList.add('d-none')
        checkedBtn.classList.remove('d-none')
        checked.append(showHTML)
        checked.append(divider)
    }
}

function ToDoTerminatedchangeDone(uuid, done) {
    fetch('http://localhost:8023/todo/done', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            uuid: uuid,
            done: done
        })
    }).then(() => {
        ToDoTerminatedtodoCleanup()
    })
}

function ToDoTerminateddeleteToDo(uuid) {
    fetch('http://localhost:8023/todo/delete/' + uuid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(() => {
            ToDoTerminatedtodoCleanup();
        })
}

function ToDoTerminatedtodoCleanup() {
    const uncheckedToDos = document.getElementById('unchecked');
    const checkedToDos = document.getElementById('checked');
    uncheckedToDos.innerHTML = "";
    checkedToDos.innerHTML = "";
    ToDoTerminatedgetToDoShowHTML();
}

ToDoTerminatedinit()
