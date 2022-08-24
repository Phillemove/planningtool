"use strict";

// Fetches Listview HTML and fills it with data fetched from list endpoint
function fetchAppointments()
{
    let dateFormat = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    };
    fetch("http://localhost:8023/appointment/list")
        .then((response) => response.json())
        .then((appointments) =>
        {
            let listDiv = document.getElementById("appointmentList");
            listDiv.innerHTML = "";
            appointments.forEach((appointment) =>
            {
                let rowDiv = document.createElement("div");
                rowDiv.className = "row";
                let colDiv1 = document.createElement("div");
                colDiv1.className = "col";
                let colDiv2 = document.createElement("div");
                colDiv2.className = "col";
                let label = document.createElement("label");
                label.classList.add("text-secondary");
                label.classList.add("my-2");
                label.classList.add("p-0");
                label.classList.add("px-1");
                label.innerHTML =
                    "Titel: " +
                    appointment["name"] +
                    "<br/>" +
                    new Date(appointment["startDate"]).toLocaleString("de-DE", dateFormat) +
                    " - " +
                    new Date(appointment["dueDate"]).toLocaleString("de-DE", dateFormat);
                colDiv1.append(label);
                rowDiv.append(colDiv1);
                // Show Button
                let showBtn = document.createElement("input");
                showBtn.type = "button";
                showBtn.value = "Show";
                showBtn.classList.add("btn");
                showBtn.classList.add("btn-secondary");
                showBtn.classList.add("btn-sm");

                showBtn.addEventListener("click", () =>
                {
                    showAppointment(appointment["uuid"]);
                });
                // Edit Button
                let editBtn = document.createElement("input");
                editBtn.type = "button";
                editBtn.value = "Edit";
                editBtn.classList.add("btn");
                editBtn.classList.add("btn-secondary");
                editBtn.classList.add("btn-sm");
                editBtn.addEventListener("click", () =>
                {
                    editAppointment(appointment["uuid"]);
                });
                // Delete Button
                let deleteBtn = document.createElement("input");
                deleteBtn.type = "button";
                deleteBtn.value = "Delete";
                deleteBtn.classList.add("btn");
                deleteBtn.classList.add("btn-secondary");
                deleteBtn.classList.add("btn-sm");
                deleteBtn.addEventListener("click", () =>
                {
                    deleteAppointment(appointment["uuid"]);
                });

                colDiv2.append(showBtn);
                colDiv2.append(editBtn);
                colDiv2.append(deleteBtn);
                rowDiv.append(colDiv2);
                listDiv.append(rowDiv);
            });
        });
}

/**
 * Fetches View and shows an individual Appointment
 * @param {Integer} id - ID of Appointment to be shown
 */
function showAppointment(id)
{
    let dateFormat = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    // How many Log Entrys shall be shown at max
    let logEntrysShown = 3;
    fetch("http://localhost:8023/appointment/html/show")
        .then((response) => response.text())
        .then((html) =>
        {
            const editDiv = document.getElementById("appointmentEdit");
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            const responseHTML = doc.body.firstChild;
            editDiv.innerHTML = ""; // Clear obsolete HTML
            editDiv.append(responseHTML);
        })
        .then(() =>
        {
            if (id != 0)
            {
                fetch("http://localhost:8023/appointment/show", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                    body: JSON.stringify({
                        uuid: id,
                    }),
                })
                    .then((response) => response.json())
                    .then((appointment) =>
                    {
                        //Fetch Logs
                        fetch("http://localhost:8023/log/appointment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            mode: "cors",
                            body: JSON.stringify({
                                uuid: id,
                            }),
                        })
                            .then((response) => response.json())
                            .then((appointmentlogs) =>
                            {
                                // LOgs test 
                                console.log(appointmentlogs);
                                //Fill Fields
                                document.getElementById("uuid").innerHTML = appointment["uuid"];
                                document.getElementById("from").innerHTML = new Date(appointment["startDate"]).toLocaleString("de-DE", dateFormat);
                                document.getElementById("to").innerHTML = new Date(appointment["dueDate"]).toLocaleString("de-DE", dateFormat);
                                document.getElementById("name").innerHTML = appointment["name"];
                                document.getElementById("description").innerHTML = appointment["description"];
                                // Show Participants
                                let participantsHTML = "";
                                appointment.participants.forEach(participant =>
                                {
                                    participantsHTML += participant[0].surname + " " + participant[0].name + "<br /> ";
                                });
                                document.getElementById("participants").innerHTML = participantsHTML;
                                // Create File download Links and show Files TDOD: Links and Download - waiting for DB support
                                let filesHTML = "";
                                appointment.files.forEach(file =>
                                {
                                    filesHTML += "Titel: " + file[0].filename + "<br />" + "Beschreibung: " + file[0].description + "<br /><br />";
                                });
                                document.getElementById("files").innerHTML = filesHTML;
                                let logHTML = "";
                                let i = 0;
                                // Show last few Log Entrys for this Appointment
                                for (let i = 0; i < appointmentlogs.length && i <= logEntrysShown; i++)
                                {
                                    let changeJSON = JSON.parse(appointmentlogs[i].change);
                                    logHTML += " - " + appointmentlogs[i].user + " hat Funktion \"" + changeJSON.funcName + "\" am " + appointmentlogs[i].changedAt + " ausgeführt. <br/>";
                                }
                                document.getElementById("logging").innerHTML = logHTML;
                            });
                    });
            }
        })
        .then(() =>
        {
            document
                .getElementById("appointmentCancel")
                .addEventListener("click", () =>
                {
                    document.getElementById("appointmentEdit").innerHTML = "";
                });
        });
}

/**
 * Deletes an Appointment by sending id to delete endpoint
 * @param {Integer} id - ID of Appointment to be deleted
 */
function deleteAppointment(id)
{
    fetch("http://localhost:8023/appointment/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
            uuid: id,
        })
    })
        .then(() =>
        {
            // Fetch all Appointments, to display changes
            fetchAppointments();
        });
}

/**
 * Fetches an individual Appointment and fills Edit form with data
 * excessive nesting is neccessary because of the reliance on promises
 * and their fullfillment
 * @param {Integer} id - ID of Appointment to be edited
 */
function editAppointment(id)
{
    fetch("http://localhost:8023/appointment/html/edit")
        .then((response) => response.text())
        .then((html) =>
        {
            const editDiv = document.getElementById("appointmentEdit");
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            const responseHTML = doc.body.firstChild;
            editDiv.innerHTML = ""; // Clear obsolete HTML
            editDiv.append(responseHTML);
        })
        .then(() =>
        {
            fetch("http://localhost:8023/file")
                .then(response => response.json())
                .then(files =>
                {
                    console.log(files)
                    // FilesType Array created
                    fetch("http://localhost:8023/contact")
                        .then(response => response.json())
                        .then(contacts =>
                        {
                            if (id != 0)
                            {
                                //Edit mode - fill Input fields
                                fetch("http://localhost:8023/appointment/show", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    mode: "cors",
                                    body: JSON.stringify({
                                        uuid: id,
                                    }),
                                })
                                    .then((response) => response.json())
                                    .then((appointment) =>
                                    {
                                        //Fill Fields
                                        document.getElementById("uuid").value = appointment["uuid"];
                                        document.getElementById("from").value = appointment["startDate"];
                                        document.getElementById("to").value = appointment["dueDate"];
                                        document.getElementById("name").value = appointment["name"];
                                        document.getElementById("description").value = appointment["description"];
                                        //Show Participants with selection
                                        let participantsHTML = "";
                                        let selected;
                                        contacts.forEach(contact =>
                                        {
                                            selected = false;
                                            appointment.participants.forEach(participant =>
                                            {
                                                if (participant[0].uuid == contact.uuid)
                                                {
                                                    selected = true;
                                                }
                                            });
                                            if (selected == true)
                                            {
                                                participantsHTML += "<option selected value=\"" + contact.uuid + "\">" + contact.name + ", " + contact.surname + "</OPTION>";
                                            } else
                                            {
                                                participantsHTML += "<option value=\"" + contact.uuid + "\">" + contact.name + ", " + contact.surname + "</OPTION>";
                                            }
                                        });
                                        document.getElementById("participants").innerHTML = participantsHTML;
                                        // Show Files with selection
                                        let fileshtml = "";
                                        files.forEach(file =>
                                        {
                                            selected = false;
                                            appointment.files.forEach(fileApp =>
                                            {
                                                if (fileApp[0].uuid == file.uuid)
                                                {
                                                    selected = true;
                                                }
                                            });
                                            if (selected == true)
                                            {
                                                fileshtml += "<option selected value=\"" + file.uuid + "\">" + file.filename + "</OPTION>";
                                            } else
                                            {
                                                fileshtml += "<option value=\"" + file.uuid + "\">" + file.filename + "</OPTION>";
                                            }
                                        });
                                        document.getElementById("files").innerHTML = fileshtml;
                                    });
                            } else
                            {
                                // new mode
                                document.getElementById("uuid").value = "new";
                                // Show participants without selection
                                let participantsHTML = "";
                                contacts.forEach(contact =>
                                {
                                    participantsHTML += "<option value=\"" + contact.uuid + "\">" + contact.name + ", " + contact.surname + "</OPTION>";
                                });
                                document.getElementById("participants").innerHTML = participantsHTML;
                                // Show Files without selection
                                let fileshtml = "";
                                files.forEach(file =>
                                {
                                    fileshtml += "<option value=\"" + file.uuid + "\">" + file.filename + "</OPTION>";
                                });
                                document.getElementById("files").innerHTML = fileshtml;
                                // Dont show logging?
                                //TODO
                            }
                        });
                });
        })
        .then(() =>
        {
            // Eventlistener - Cancel Button - just clears
            document
                .getElementById("appointmentCancel")
                .addEventListener("click", () =>
                {
                    document.getElementById("appointmentEdit").innerHTML = "";
                });
            // Eventlistener - Save Button - send Data to Server
            document
                .getElementById("appointmentSave")
                .addEventListener("click", () =>
                {
                    // Get Values from Fields
                    let uuid = document.getElementById("uuid").value;
                    let name = document.getElementById("name").value;
                    let description = document.getElementById("description").value;
                    let from = document.getElementById("from").value;
                    let to = document.getElementById("to").value;
                    // Gets only selected Options and the values from that
                    let participants = [...document.getElementById("participants").selectedOptions].map(option => parseInt(option.value));
                    let files = [...document.getElementById("files").selectedOptions].map(option => parseInt(option.value));
                    fetch("http://localhost:8023/appointment/edit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        mode: "cors",
                        body: JSON.stringify({
                            uuid: uuid,
                            name: name,
                            description: description,
                            from: from,
                            to: to,
                            participants: participants,
                            files: files,
                        })
                    }).then(() =>
                    {
                        // Fetch all Appointments, to display changes
                        fetchAppointments();
                        //Maybe clear edit Form?
                    });
                });
        });
}

// Initial starting point fetches data and views for site display
document.addEventListener("DOMContentLoaded", () =>
{
    document.getElementById("appointment-nav").addEventListener("click", () =>
    {
        fetch("http://localhost:8023/appointment")
            .then((response) => response.text())
            .then((html) =>
            {
                let centerDiv = document.getElementById("content");
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                let responseHTML = doc.body.firstChild;
                centerDiv.innerHTML = "";
                centerDiv.append(responseHTML);
            })
            .then(() =>
            {
                // Add Listener for new Appointment
                document
                    .getElementById("appointmentNew")
                    .addEventListener("click", () =>
                    {
                        editAppointment(0);
                    });
                // Load Listview
                fetch("http://localhost:8023/appointment/html/list")
                    .then((response) => response.text())
                    .then((html) =>
                    {
                        let listDiv = document.getElementById("appointmentsShow");
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(html, "text/html");
                        let responseHTML = doc.body.firstChild;
                        listDiv.innerHTML = "";
                        listDiv.append(responseHTML);
                    })
                    .then(() =>
                    {
                        fetchAppointments();
                    });
            });
    });
});
