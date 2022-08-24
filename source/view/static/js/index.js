"use strict"

document.addEventListener("DOMContentLoaded", () => {
    /**
     * This fetch calls all installed Plugins and add the Items to the navbar. The onEventListeners are setted in the
     * main Plugin Javascript files
     */
    fetch('http://localhost:8023/plugin/init')
        .then(data => data.json())
        .then(json => {
            const menu = document.getElementById('navbarList')
            json.forEach(item => {
                const li = document.createElement('li')
                const img = document.createElement('img')
                img.setAttribute(`src`, `${item.folder}/images/icon.png`)
                img.setAttribute('width',40)
                img.setAttribute('hight', 40)
                img.classList.add('nav-link')
                img.id = `${item.folder}_nav`
                li.append(img)
                li.classList.add('nav-item')
                const script = document.createElement('script')
                script.setAttribute('src', `/${item.folder}/js/${item.jsFiles}`)
                document.head.appendChild(script)
                menu.append(li)
            })
        })
})