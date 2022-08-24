"use strict"

document.addEventListener('DOMContentLoaded', () => {
    const menuShop = document.getElementById("shop-nav")
    menuShop.addEventListener("click", () => {
        buildShop()
    })
})

/**
 * This Function order the main Shop HTML Element
 */
async function buildShop() {
    fetch('http://localhost:8023/shop')
        .then(response => response.text())
        .then(html => {
            const centerDiv = document.getElementById("content");
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html')
            const responseHTML = doc.body.firstChild;
            centerDiv.innerHTML = ""
            centerDiv.classList.add('py-3', 'container')
            const rowDIV = document.createElement('div')
            rowDIV.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'mb-3', 'text-center')
            rowDIV.id = 'shoplist-container'
            centerDiv.append(rowDIV)
            getPlugins(responseHTML)
        })
}

/**
 * This Function order the Plugins from the Server
 * @param {HTML} HTML
 */
async function getPlugins(HTML) {
        fetch('http://localhost:8023/shop/items')
            .then(response => response.json())
            .then(data => {
                    const shopDiv = document.getElementById('shoplist-container')
                    for (let i = 0; i < data.length; i++){
                            const container = HTML.cloneNode(true)
                            const title = container.getElementsByClassName('plugin-title')[0]
                            title.innerText = data[i].name;
                            const descriptionIMG = container.getElementsByClassName('plugin-image')[0]
                            descriptionIMG.setAttribute('src', `./${data[i].folder}/images/${data[i].description_image}`)
                            const description = container.getElementsByClassName('plugin-description')[0]
                            description.innerText = data[i].description
                            const pluginBtn = container.getElementsByTagName('button')[0]
                            if (data[i].installed) {
                                pluginBtn.classList.add('btn-secondary')
                                pluginBtn.innerText = 'Entfernen'
                                pluginBtn.addEventListener('click', () => remove(data[i]))
                            } else {
                                pluginBtn.classList.add('btn-primary')
                                pluginBtn.innerText = 'Hinzufügen'
                                pluginBtn.addEventListener('click', () => install(data[i]))
                            }

                            shopDiv.append(container)
                    }

            })
}

/**
 * This Function installs the choosen Plugin. It set the Nav-Bar Icon and call buildShop()
 * @param plugin
 * @returns {Promise<void>}
 */
async function install(plugin) {
    fetch('http://localhost:8023/plugin/install', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({folder: plugin.folder})
    })
        .then((data) => {
            if (data.status === 200) {
                const menu = document.getElementById('navbarList')
                const li = document.createElement('li')
                const img = document.createElement('img')
                img.setAttribute(`src`, `${plugin.folder}/images/icon.png`)
                img.classList.add('nav-link')
                img.id = `${plugin.folder}_nav`
                img.setAttribute('width', 40)
                img.setAttribute('height', 40)
                li.append(img)
                li.classList.add('nav-item')
                const script = document.createElement('script')
                script.setAttribute('src', `/${plugin.folder}/js/${plugin.jsFiles}`)
                document.head.appendChild(script)
                menu.append(li)
                buildShop()
            } else if (data.status === 500) {
                console.error('Fehler aufgetreten. Plugin wurde nicht installiert')
            }
        })
}

/**
 * This Function send the order to the Server to remove the Plugin from the plugin Folder.
 * @param {Plugin} plugin
 */
async function remove(plugin) {
    fetch('http://localhost:8023/shop/remove', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(plugin)
    })
        .then((data) => {
            if (data.status === 200) {
                removeScript(plugin)
                removeLi(plugin)
                buildShop()
            } else if (data.status === 500) {
                console.error('Fehler aufgetreten. Plugin wurde nicht installiert')
            }
        })
}

/**
 * This Function remove the Script from the index.html
 * @param {Plugin} plugin
 */
function removeScript(plugin) {
    const scripts = document.getElementsByTagName('script')
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes(plugin.folder)){
            scripts[i].parentNode.removeChild(scripts[i])
        }
    }
}


function removeLi(plugin) {
    const imgItem = document.getElementById(`${plugin.folder}_nav`)
    const parent = imgItem.parentNode
    parent.parentNode.removeChild(parent)
}