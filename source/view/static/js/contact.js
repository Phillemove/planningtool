"use strict"
//Frontend Javascript file for contacts

//Adding Eventlistener to navbar icon Contactbook and opens contactbook view after click on it
document.addEventListener("DOMContentLoaded", () => {
    const Btn = document.getElementById("contact-nav")
    Btn.addEventListener("click", () => {
        const indexHTMLDiv = document.getElementById("content")
        indexHTMLDiv.innerHTML = ""
        let showContactDiv = document.createElement('div');
        showContactDiv.id = 'showContactDiv'
        indexHTMLDiv.append(showContactDiv)
        getContacts();
    })
})

//Fetching contactbook.html and all contacts and show them in view
function getContacts() {
    const showContactDiv  = document.getElementById('showContactDiv')
    showContactDiv.innerHTML = ""
    fetch('http://localhost:8023/contact/html/show')
        .then(response => response.text())
        .then(html => {
            showContactDiv.innerHTML = html;
            createContacts();
        })
        .then(() => {
            fetch('http://localhost:8023/contact')
                .then(response => response.json())
                .then(data => {
                    const contactlist = document.getElementById("contactlist");
                    data.forEach(element => {
                        let contactLi = document.createElement('li');
                        let boderDiv = document.createElement('div');
                        contactLi.id = element.uuid;
                        contactLi.className = "nav-item"
                        contactLi.innerText = element.name + ", " + element.surname;
                        boderDiv.className = "p-2 m-1 border-black-25 border-bottom";
                        contactLi.append(boderDiv);
                        contactlist.append(contactLi);
                        showDetails(element);
                    })
                })
        })
}

//Adding Eventlistener to delete and update contact Button
function modifyContacts(contact){
    const deleteButton = document.getElementById("deletecontact");
    const updateButton = document.getElementById("updatecontact");
    deleteButton.addEventListener("click", () => {
        deleteContact(contact);
    });
    updateButton.addEventListener("click", () => {
        updateContact(contact);
    });
}

//Adding Eventlistener to create contact button
function createContacts(){
    const createButton = document.getElementById("createcontact");
    createButton.addEventListener("click", createContact);
}

//Adding eventlistener to contactlist element. After click fetching contactdetails.html
//and showing detail information about clicked contact
function showDetails(contact){
    const detailsDiv = document.getElementById('contactdetails');
    detailsDiv.innerHTML = "";
    const activeContact = document.getElementById(contact.uuid);
    activeContact.style.marginBottom = "1em";
    activeContact.addEventListener("click",() => {
        fetch('http://localhost:8023/contact/html/details')
        .then(response => response.text())
        .then(html => {
            detailsDiv.innerHTML = html;
            modifyContacts(contact);
        })
        .then( () => {
            let currentactive = document.getElementsByClassName("active");
            if(currentactive.length > 0) {
                currentactive[0].className = currentactive[0].className.replace(" active", "");
            }
            activeContact.className += " active";
            const surnameDiv = document.getElementById("surname");
            const familynameDiv = document.getElementById("familyname");
            const emailDiv = document.getElementById("email");
            const addressDiv = document.getElementById("address");
            const fileDiv = document.getElementById("files");
            let surname = document.createElement('div');
            let email = document.createElement('div');
            let familyname = document.createElement('div');
            let address = document.createElement('div');
            let files = document.createElement('div');
            surname.id = 'surname';
            familyname.id = 'familyname';
            email.id = 'email';
            address.id = 'address';
            files.id = 'files';
            surname.innerText = contact.surname;
            familyname.innerText = contact.name;
            email.innerText = contact.email;
            address.innerText = contact.address[0].street + " " + contact.address[0].houseNumber + 
            "\n" + contact.address[0].location[0].zip + " " + contact.address[0].location[0].location;
            for(let i = 0; i<contact.files.length; i++) {
                files.innerText = contact.files[i][0].filename + "\n" + files.innerText;
            }
            surnameDiv.append(surname);
            familynameDiv.append(familyname);
            emailDiv.append(email);
            addressDiv.append(address);
            fileDiv.append(files);
            familynameDiv.style.marginTop = "1em";
            surnameDiv.style.marginTop = "1em";
            emailDiv.style.marginTop = "1em";
            addressDiv.style.marginTop = "1em"; 
            fileDiv.style.marginTop = "1em";        
        })
    });
}

//Fetching create contact form html and add fuctionality to submit and cancel button.
//Click on submit sends data from form via post to create Endpoint
function createContact() {
    const createContactDiv  = document.getElementById('contactdetails');
    createContactDiv.innerHTML = "";
    fetch('http://localhost:8023/contact/html/create')
    .then(response => response.text())
    .then(html => {
        createContactDiv.innerHTML = html;
        fetch('http://localhost:8023/file/')
        .then(response => response.json())
        .then(files => {
           const chooser = document.getElementById("contactfile-chooser");
           files.forEach(element => {
               let option = document.createElement("option");
               option.value = element.uuid;
               option.innerText = element.filename;
               chooser.append(option);
           })
        })
    })
    .then(() => {
        document.getElementById("createcontactcancel").addEventListener("click", () => {
            getContacts();
        });
        document.getElementById("createcontactsubmit").addEventListener("click", () => {
            const name = document.getElementsByClassName("contact-familyname-input")[0].value;
            document.getElementsByClassName("contact-familyname-input")[0].value = "";
            const surname = document.getElementsByClassName("contact-surname-input")[0].value;
            document.getElementsByClassName("contact-surname-input")[0].value = "";
            const email = document.getElementsByClassName("contact-email-input")[0].value;
            document.getElementsByClassName("contact-email-input")[0].value = "";
            const street = document.getElementsByClassName("contact-street-input")[0].value;
            document.getElementsByClassName("contact-street-input")[0].value = "";
            const housenumber = document.getElementsByClassName("contact-housenumber-input")[0].value;
            document.getElementsByClassName("contact-housenumber-input")[0].value = "";
            const zip = document.getElementsByClassName("contact-zip-input")[0].value;
            document.getElementsByClassName("contact-zip-input")[0].value = "";
            const location = document.getElementsByClassName("contact-location-input")[0].value;
            document.getElementsByClassName("contact-location-input")[0].value = "";
            const files = getFileAttachements(document.getElementById("contactfile-chooser"));
            if (street == null || street == "" || housenumber == null || housenumber == "" || zip == null || zip == "" || location == null || location == "") {
                createContact();
            } else {
                fetch('http://localhost:8023/contact/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        name: name,
                        surname: surname,
                        email: email,
                        street: street,
                        housenumber: housenumber,
                        zip: zip,
                        location: location,
                        files: files
                    })
                })         
                .then(response => response.text())
                .then(() => {
                    getContacts();
                })
            }
        })
    })
}

//Fetching delete confirm view and set functionality to buttons.
//Click on confirm delete sends data to delete endpoint
function deleteContact(contact) {
    const deleteContactDiv  = document.getElementById('contactdetails');
    deleteContactDiv.innerHTML = "";
    fetch('http://localhost:8023/contact/html/delete')
    .then(response => response.text())
    .then(html => {
        deleteContactDiv.innerHTML = html;
    })
    .then(() => {
        const deletesubmit = document.getElementById("deletecontactsubmit");
        const deletecancel = document.getElementById("deletecontactcancel");
        deletecancel.addEventListener("click", () => {
            document.getElementById(contact.name).click();
        })
        deletesubmit.addEventListener("click", () => {
            fetch('http://localhost:8023/contact/delete/' + contact.uuid, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.text())
            .then(() => {
                getContacts();
            })

        })
    })
}

//Fetch update contact form and fill with current contact informations. Add eventlistener to submit and cancel button.
//Click on Submit sends data via PUT to update endpoint
function updateContact(contact) {
    const updateContactDiv  = document.getElementById('contactdetails');
    updateContactDiv.innerHTML = "";
    fetch('http://localhost:8023/contact/html/update')
    .then(response => response.text())
    .then(html => {
        updateContactDiv.innerHTML = html;
        fetch('http://localhost:8023/file/')
        .then(response => response.json())
        .then(files => {
           const chooser = document.getElementById("contactfile-chooser");
           files.forEach(element => {
               let option = document.createElement("option");
               option.value = element.uuid;
               option.innerText = element.filename;
               chooser.append(option);
           })
        })
    })
    .then(() => {
        document.getElementsByClassName("contact-familyname-input")[0].value = contact.name;
        document.getElementsByClassName("contact-surname-input")[0].value = contact.surname;
        document.getElementsByClassName("contact-email-input")[0].value = contact.email;
        document.getElementsByClassName("contact-street-input")[0].value = contact.address[0].street;
        document.getElementsByClassName("contact-housenumber-input")[0].value = contact.address[0].houseNumber;
        document.getElementsByClassName("contact-zip-input")[0].value = contact.address[0].location[0].zip;
        document.getElementsByClassName("contact-location-input")[0].value = contact.address[0].location[0].location;
        document.getElementById("updatecontactcancel").addEventListener("click", () => {
            document.getElementById(contact.name).click();
        })
        document.getElementById("updatecontactsubmit").addEventListener("click", () => {
            const name = document.getElementsByClassName("contact-familyname-input")[0].value;
            const surname = document.getElementsByClassName("contact-surname-input")[0].value;
            const email = document.getElementsByClassName("contact-email-input")[0].value;
            const street = document.getElementsByClassName("contact-street-input")[0].value;
            const housenumber = document.getElementsByClassName("contact-housenumber-input")[0].value;
            const zip = document.getElementsByClassName("contact-zip-input")[0].value;
            const location = document.getElementsByClassName("contact-location-input")[0].value;
            const files = getFileAttachements(document.getElementById("contactfile-chooser"));
            if (street == null || street == "" || housenumber == null || housenumber == "" || zip == null || zip == "" || location == null || location == "") {
                updateContact(contact);
            } else {
                fetch('http://localhost:8023/contact/update/' + contact.uuid, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        name: name,
                        surname: surname,
                        email: email,
                        street: street,
                        housenumber: housenumber,
                        zip: zip,
                        location: location,
                        files: files     
                    })
                })
                .then(response => response.text())
                .then(() => {
                    getContacts();
                }) 
            }
        })
    })
}

// Read Value of selected Options in given select HTML Element and return it as an Array
function getFileAttachements(select) {
    const partSelected = [...select.options].filter(option => option.selected).map(option => option.value)
    for (let i = 0; i < partSelected.length; i++){
        partSelected[i] = (parseInt(partSelected[i]))
    }
    return partSelected;
}