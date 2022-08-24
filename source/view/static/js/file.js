"use strict"

document.addEventListener('DOMContentLoaded', () => {
    const menuFileUploadBtn = document.getElementById("file-nav")
    menuFileUploadBtn.addEventListener("click", () => {
        const indexHTMLDiv = document.getElementById("content")
        indexHTMLDiv.innerHTML = ""
        let showFileDiv = document.createElement('div')
        showFileDiv.id = 'showFileDiv'
        indexHTMLDiv.append(showFileDiv)
        loadFileUploader()
        displayFileManager()
    })
})

//Method to load our fileuploader from endpoint
function loadFileUploader() {
    const showFileDiv = document.getElementById('showFileDiv')
    showFileDiv.innerHTML = ""
    fetch('http://localhost:8023/file/html/show')
        .then(response => response.text())
        .then(html => {
            showFileDiv.innerHTML = html;
        })
}

//Method to display pur FIle Manager
function displayFileManager() {
    fetch('http://localhost:8023/file/filemanager')
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            let dataCopy = []
            for (let i = 0; i < data.length; i++) {
                console.log(data[i])
                dataCopy[i] = data[i]
            }
            console.log(dataCopy)

            let list = document.getElementById('content')


            for (let file = 0; file < dataCopy.length; file++) {
                let li = document.createElement('a')
                li.id = 'li'
                li.setAttribute('href', null)

                let deleteButton = document.createElement('button')
                deleteButton.id = 'deleteButton'
                deleteButton.innerHTML = 'Löschen'
                list.appendChild(deleteButton)

                li.innerHTML = dataCopy[file].filename + "<br>"
                list.appendChild(li)

                //Eventlistener for open file
                li.addEventListener("click", () => {
                    let attr = "href"
                    let url = "http://localhost:8023/file/uploads/" + dataCopy[file].uuid
                    console.log(url)
                    getIndexOfData(file)
                    li.setAttribute(attr, url)

                })

                //Eventlistener to delete files
                deleteButton.addEventListener("click", () => {
                    console.log("Deleting files.")
                    let url = "http://localhost:8023/file/delete/" + dataCopy[file].uuid
                    fetch(url)
                        .then(response => response.text())
                        .then(data => console.log(data));

                    console.log("http://localhost:8023/file/delete/" + dataCopy[file])
                    alert("Drücke 'OK' das löschen zu bestätigen. Die Seite wird neugeladen.")
                    location.reload();
                })
            }
        }).catch((error) => {
            console.log(error)
        })
}

function getIndexOfData(indexData) {
    let index = indexData
    fetch("http://localhost:8023/file/fileIndex", {
        method: "POST",
        body: JSON.stringify({
            index: index
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        // Converting to JSON
        .then(response => response.json())
}

