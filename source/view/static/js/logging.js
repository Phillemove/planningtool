"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const Btn = document.getElementById("log-nav")
    Btn.addEventListener("click", () => logInitialization() )

})

/**
 * This Function order the main HTML Element
 */
function logInitialization() {
    fetch('http://localhost:8023/log/html/surrounder')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const showHTML = doc.body.firstChild;
            const content = document.getElementById('content');
            content.innerHTML = "";
            content.append(showHTML)
            getLogHTML()
        })
}

/**
 * This Function order the HTML Element which is to show every separat Log
 */
function getLogHTML() {
    fetch('http://localhost:8023/log/html/log')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const showHTML = doc.body.firstChild;
            getLogs(showHTML);
        })
}


function getLogs(showHTML) {
    fetch('http://localhost:8023/log/')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                const givenHTML = showHTML.cloneNode(true);
                createHTMLLog(element, givenHTML);
            })
        })
}

/**
 * This Function write the Log-Datas in the HTML Element and append it to the main Element
 * @param {Log} log
 * @param {HTML} givenHTML
 */
function createHTMLLog(log, givenHTML) {

    const dateFormat = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const objUUID = givenHTML.getElementsByClassName('log-obj-uuid')[0]
    const objuser = givenHTML.getElementsByClassName('log-obj-user')[0]
    const objchangedAt = givenHTML.getElementsByClassName('log-obj-changedAt')[0]
    const objtype = givenHTML.getElementsByClassName('log-obj-type')[0]



    const userTN = document.createTextNode(log.user)
    objuser.appendChild(userTN)
    const changedAtTN = document.createTextNode(new Date(log.changedAt).toLocaleString("de-DE", dateFormat))
    objchangedAt.appendChild(changedAtTN)
    const typeTN = document.createTextNode(JSON.parse(log.change).funcType)
    objtype.appendChild(typeTN)

    if (log.appointment_uuid !== null) {
        const uuidTN = document.createTextNode(log.appointment_uuid)
        objUUID.appendChild(uuidTN)
        document.getElementById('Appointment_logging').append(givenHTML)
    } else if (log.todo_uuid !== null) {
        const uuidTN = document.createTextNode(log.todo_uuid)
        objUUID.appendChild(uuidTN)
        document.getElementById('ToDo_logging').append(givenHTML)
    } else if (log.contact_uuid !== null) {
        const uuidTN = document.createTextNode(log.contact_uuid)
        objUUID.appendChild(uuidTN)
        document.getElementById('Contact_logging').append(givenHTML)
    } else if (log.file_uuid !== null) {
        const uuidTN = document.createTextNode(log.file_uuid)
        objUUID.appendChild(uuidTN)
        document.getElementById('File_logging').append(givenHTML)
    } else {
        document.getElementById('Else_logging').append(givenHTML)
    }
}