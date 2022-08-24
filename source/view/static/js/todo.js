"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const Btn = document.getElementById("todo-nav")
    Btn.addEventListener("click", () => todoInitialization() )
})


function todoInitialization() {
    const indexHTMLDiv = document.getElementById("content")
    indexHTMLDiv.innerHTML = ""
    let showToDoDiv = document.createElement('div');
    showToDoDiv.id = 'showToDoDiv'
    let createToDoDiv = document.createElement('div');
    createToDoDiv.id = 'createToDoDiv'
    indexHTMLDiv.append(showToDoDiv)
    indexHTMLDiv.append(createToDoDiv)
    getCreateToDoHtml();
    getTodoShowHTML();
}

/**
 * This Function get the ToDo Main HTML Element
 */
function getTodoShowHTML() {
    fetch('http://localhost:8023/todo/html/show')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const showHTML = doc.body.firstChild;
            getTodos(showHTML);
        })
}

/**
 * This Function order the ToDos from the Server
 * @param {HTML} showHTML
 */
function getTodos(showHTML) {
    fetch('http://localhost:8023/todo')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                const givenHTML = showHTML.cloneNode(true)
                createHtmlToDo(element, givenHTML)
                //showTest(givenHTML)
            })
        })

}

/**
 * This Function read from the select Object the choosen Elements
 * @param {select} select
 * @returns {*[]}
 */
function getToDoAttachments(select) {
    const partSelected = [...select.options].filter(option => option.selected).map(option => option.value)
    for (let i = 0; i < partSelected.length; i++){
        partSelected[i] = (parseInt(partSelected[i]))
    }
    return partSelected;
}

/**
 * This Function show the Create ToDo HTML Area
 */
function getCreateToDoHtml() {
    const createToDoDiv = document.getElementById('createToDoDiv')
    fetch('http://localhost:8023/todo/html/create')
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html')
            const responseHTML = doc.body.firstChild;
            const addDateBtn = responseHTML.getElementsByClassName('todo-add-date-btn')[0]
            const addTimeBtn = responseHTML.getElementsByClassName('todo-add-time-btn')[0]
            const addParticipantsBtn = responseHTML.getElementsByClassName('todo-add-participants-btn')[0]
            const addFilesBtn = responseHTML.getElementsByClassName('todo-add-files-btn')[0]
            addParticipantsBtn.addEventListener('click', () => {
                fetch('http://localhost:8023/contact/')
                    .then(response => response.json())
                    .then(contacts => {
                        if(Object.keys(contacts).length === 0){
                            addParticipantsBtn.classList.add('btn-danger')
                            alert('Keine Teilnehmer verfügbar')
                        } else {
                            const selectList = responseHTML.getElementsByClassName('participant-chooser')[0]
                            for(let i = 0; i < contacts.length; i++) {
                                const contact = contacts[i]
                                const opt = document.createElement('option')
                                opt.value = contact.uuid
                                opt.innerText = `${contact.name} ${contact.surname}`
                                selectList.append(opt)
                            }
                            const partDiv = responseHTML.getElementsByClassName('div-participants-selecter')[0]
                            partDiv.classList.remove('d-none')
                            addParticipantsBtn.classList.add('d-none')
                        }
                    })
            })
            addFilesBtn.addEventListener('click', () => {
                fetch('http://localhost:8023/file/')
                    .then(response => response.json())
                    .then(files => {
                        if(Object.keys(files).length === 0){
                            addFilesBtn.classList.add('btn-danger')
                            alert('Keine Dateien verfügbar')
                        } else {
                            const selectList = responseHTML.getElementsByClassName('file-choosers')[0]
                            for(const file of files) {
                                console.log(file)
                                const opt = document.createElement('option')
                                opt.value = file.uuid
                                opt.innerText = file.filename
                                selectList.append(opt)
                            }
                            const fileDiv = responseHTML.getElementsByClassName('div-files-selecter')[0]
                            fileDiv.classList.remove('d-none')

                            addFilesBtn.classList.add('d-none')
                        }
                    })
            })
            addDateBtn.addEventListener('click', () => {
                const dateDiv = responseHTML.getElementsByClassName('div-date-picker')[0]
                dateDiv.classList.remove('d-none')
                dateDiv.classList.add('d-flex')
                addDateBtn.classList.add('d-none')
            })
            addTimeBtn.addEventListener('click', () => {
                const TimeDiv = responseHTML.getElementsByClassName('div-time-picker')[0]
                TimeDiv.classList.remove('d-none')
                TimeDiv.classList.add('d-flex')
                addTimeBtn.classList.add('d-none')
            })

            responseHTML.getElementsByClassName('todo-add-btn')[0].addEventListener('click', () => {
                const title = responseHTML.getElementsByClassName('todo-title-input')[0].value
                const description = responseHTML.getElementsByClassName('todo-description-input')[0].value
                const date = responseHTML.getElementsByClassName('todo-date-input')[0].value
                const time = responseHTML.getElementsByClassName('todo-time-input')[0].value
                let dueDate = readToDoDueDate(date, time);
                const partSelected = getToDoAttachments(responseHTML.getElementsByClassName('participant-chooser')[0]);
                const fileSelected = getToDoAttachments(responseHTML.getElementsByClassName('file-choosers')[0]);

                if (title !== "" && title !== null) {
                    fetch('http://localhost:8023/todo/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors',
                        body: JSON.stringify({
                            title:title,
                            description:description,
                            dueDate:dueDate,
                            participants: partSelected,
                            files: fileSelected
                        })
                    }).then(() => {
                        todoCleanup();
                    })
                } else {
                    alert("Es muss ein Titel einegeben werden");
                }



            })

            createToDoDiv.append(responseHTML)
        })
}

/**
 * This Function read the Values of date and time and make a Date Object
 * @param {String} date
 * @param {String} time
 * @returns {Date}
 */
function readToDoDueDate(date, time) {
    let dueDate = null;
    if(date !== '' && time === ''){
        dueDate = new Date(date).setHours(0,0) / 1000
    } else if (date === '' && time !== '') {
        const hoursMinutes = time.split(":")
        dueDate = new Date().setHours(hoursMinutes[0],hoursMinutes[1]) / 1000
    } else if (date !== '' && time !== '') {
        dueDate = new Date(date + 'T' + time) / 1000
    }
    return dueDate;
}

/**
 * This Function send the delete order to the Server
 * @param {Int} uuid
 */
function deleteToDo(uuid) {
    fetch('http://localhost:8023/todo/delete/' + uuid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(() => {
            todoCleanup();
        })
}

/**
 * This Function read the dueDate and show it in a own Format. This is be added to the HTML Element and this is the Element,
 * which is the return value.
 * @param {ToDo} todo
 * @param {HTML} showHTML
 * @returns {HTML}
 */
function showDueDate(todo, showHTML) {
    const dueDate = new Date(todo.dueDate * 1000)
    const dueDateP = showHTML.getElementsByClassName('todo-dueDate')[0];
    if(dueDate.getHours() === 0 && dueDate.getMinutes() === 0) {
        dueDateP.innerText = `${dueDate.getDate()}. ${dueDate.getMonth() + 1} ${dueDate.getFullYear()}`
    } else {
        dueDateP.innerText = `${dueDate.getDate()}. ${dueDate.getMonth() + 1} ${dueDate.getFullYear()}  ${dueDate.getHours()}:${dueDate.getMinutes()} Uhr`
    }
    if (dueDate < new Date()) {
        dueDateP.classList.add('text-danger')
    }
    //TODO: Text Rot, wenn das Datum in der Vergangenheit liegt
    return showHTML;
}

/**
 * This Function change the HTML Element of the Selected ToDo into the Edit Mode. With this, all the functionalities
 * to edit the todo are shown.
 * @param {HTML} showHTML
 * @param {ToDo} todo
 * @param {HTML} editBtn
 */
async function editToDo(showHTML, todo, editBtn) {
    const dueDateInput = showHTML.getElementsByClassName('todo-input-picker-date')[0];
    const dueTimeInput = showHTML.getElementsByClassName('todo-input-picker-time')[0];
    const todoPartDiv = showHTML.getElementsByClassName('todo-participant-div')[0];
    const todoFileDiv = showHTML.getElementsByClassName('todo-file-div')[0];
    const acceptBtn = showHTML.getElementsByClassName('check-Btn')[0];
    const declineBtn = showHTML.getElementsByClassName('breakup-Btn')[0];
    acceptBtn.classList.remove('d-none');
    declineBtn.classList.remove('d-none');
    editBtn.classList.add('d-none');
    dueDateInput.classList.remove('d-none');
    dueTimeInput.classList.remove('d-none');
    showHTML.getElementsByClassName('due')[0].firstElementChild.remove()
    if(todo.dueDate !== null) {
        const dueDate = new Date(todo.dueDate * 1000)
        let day = dueDate.getDate();
        let month = dueDate.getMonth() + 1
        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day
        dueDateInput.value = `${dueDate.getFullYear()}-${month}-${day}`
        if(dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0) {
            let hours = dueDate.getHours();
            let minutes = dueDate.getMinutes();
            hours = hours < 10 ? '0' + hours : hours
            minutes = minutes < 10 ? '0' + minutes : minutes
            dueTimeInput.value = `${hours}:${minutes}`
        }
    }

    todoPartDiv.innerHTML = ""
    //Teilnehmer:
    const select = document.createElement('select')
    select.setAttribute('multiple', 'true');
    select.setAttribute('size',3);
    fetch('http://localhost:8023/contact/')
        .then(response => response.json())
        .then(contacts => {
            for(let i = 0; i < contacts.length; i++) {
                const contact = contacts[i]
                const opt = document.createElement('option')
                opt.value = contact.uuid
                opt.innerText = `${contact.name} ${contact.surname}`
                if (todo.participants.some(part => part[0].uuid === contact.uuid)){
                    opt.setAttribute('selected', 'true')
                }
                select.append(opt)
            }
            todoPartDiv.append(select);
        })


    // Dateien:

    todoFileDiv.innerHTML = "";
    const fileSelect = document.createElement('select');
    fileSelect.setAttribute('multiple', 'true');
    fileSelect.setAttribute('size',3);
    fetch('http://localhost:8023/file/')
        .then(response => response.json())
        .then(files => {
            console.log(files)
            for(const file of files){
                const opt = document.createElement('option')
                opt.value = file.uuid
                opt.innerText = `${file.filename}`
                if (todo.files.some(item => item[0].uuid === file.uuid)) {
                    opt.setAttribute('selected', 'true')
                }
                console.log(file.uuid)
                fileSelect.append(opt)
            }
            todoFileDiv.append(fileSelect);
            /*fetch('http://localhost:8023/file/type/')
                .then(response => response.json())
                .then(types => {
                    for (const type of types) {
                        const optGroup = document.createElement('optgroup')
                        optGroup.label = type.fileType;
                        for(const file of files){
                            if(file.fileType === type.uuid){
                                const opt = document.createElement('option')
                                opt.value = file.uuid
                                opt.innerText = `${file.filename}`
                                if (todo.files.some(item => item[0].uuid === file.uuid)) {
                                    opt.setAttribute('selected', 'true')
                                }
                                //fileSelect.append(opt)
                                optGroup.append(opt)
                            }
                        }
                        fileSelect.append(optGroup)
                    }

                })*/
        })

    // Title:
    const titleInput = showHTML.getElementsByClassName('todo-title-input')[0];
    titleInput.classList.remove('d-none')
    titleInput.value = todo.title
    showHTML.getElementsByClassName('todo-title')[0].classList.add('d-none')

    // Description
    const desInput = showHTML.getElementsByClassName('todo-description-input')[0];
    desInput.classList.remove('d-none')
    desInput.value = todo.description;
    showHTML.getElementsByClassName('todo-description')[0].classList.add('d-none')
    acceptBtn.addEventListener('click', () => {
        fetch('http://localhost:8023/todo/update/' + todo.uuid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                title:titleInput.value,
                description:desInput.value,
                dueDate: readToDoDueDate(dueDateInput.value, dueTimeInput.value),
                participants: getToDoAttachments(select),
                files: getToDoAttachments(fileSelect)
            })
        })
            .then(returnValue => {
                if (returnValue) {
                    todoCleanup()
                } else {
                    console.log("Update ist fehlgeschlagen")
                }
            })
    })
    declineBtn.addEventListener('click', () => {
        todoCleanup()
    })

}

/**
 * This Function fill the HTML Element with the ToDo Datas and append it to the List
 * @param {ToDo} todo
 * @param {HTML} showHTML
 */
function createHtmlToDo(todo, showHTML) {
    const title = showHTML.getElementsByClassName('todo-title')[0]
    const description = showHTML.getElementsByClassName('todo-description')[0]
    const deleteBtn = showHTML.getElementsByClassName('delete-Btn')[0]
    deleteBtn.addEventListener('click', () => deleteToDo(todo.uuid))
    title.innerText = todo.title
    description.innerText = todo.description

    if(todo.dueDate == null){
        showHTML.getElementsByClassName('todo-dueDate')[0].classList.add('d-none')
    } else {
        showHTML = showDueDate(todo, showHTML);
    }

    const checkedBtn = showHTML.getElementsByClassName('todo-checked-btn')[0]
    const uncheckedBtn = showHTML.getElementsByClassName('todo-unchecked-btn')[0]
    checkedBtn.addEventListener('click', () => {
        changeDone(todo.uuid, false)
    })
    uncheckedBtn.addEventListener('click', () => {
        changeDone(todo.uuid, true)
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

    const editBtn = showHTML.getElementsByClassName('edit-Btn')[0]
    editBtn.addEventListener('click', () => editToDo(showHTML, todo, editBtn));

    //showHTML.getElementsByClassName('todo-created-date')[0]
    //    .innerText = new Date(todo.createdAt * 1000).toLocaleDateString(undefined,{year:"numeric", month:"short", day:"numeric"})

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

/**
 * This Function change the done State of the ToDo
 * @param {Int} uuid
 * @param {Bool} done
 */
function changeDone(uuid, done) {
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
        todoCleanup()
    })
}

/**
 * After changes this Function delete all Show ToDo-HTML Elements and call the getToDoShowHTML Function
 */
function todoCleanup() {
    const uncheckedToDos = document.getElementById('unchecked');
    const checkedToDos = document.getElementById('checked');
    uncheckedToDos.innerHTML = "";
    checkedToDos.innerHTML = "";
    getTodoShowHTML();
}