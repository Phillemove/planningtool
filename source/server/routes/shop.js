"use strict"
const express = require('express')
const fs = require("fs");
const fse = require('fs-extra')
const path = require("path");
let router = express.Router()

/**
 * send the main HTML Element
 */
router.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../view/static/html/pluginElement.html'))
})

/**
 * send the availablePlugins
 */
router.get('/items', (req, res) => {
    const existingPlugins = []
    const exPluginFiles = fs.readdirSync('./plugins')
    exPluginFiles.forEach(folder => {
        fs.readdirSync(`./plugins/${folder}`).forEach(plugin => {
            if(plugin === 'plugin.js') {
                const Plugin = require(`../../plugins/${folder}/plugin.js`)
                const plugin = new Plugin()
                existingPlugins.push(plugin.name)
            }
        })
    })
    const availablePlugins = []
    let files = fs.readdirSync('./availablePlugins')
    files = files.filter(data => data[0] !== '.')
    files.forEach(folder => {
        fs.readdirSync('./availablePlugins/' + folder).forEach(plugin => {
            if(plugin === "plugin.js") {
                const Plugin = require(`../../availablePlugins/${folder}/plugin.js`)
                const plugin = new Plugin().toClient()
                plugin.installed = existingPlugins.includes(plugin.name);
                availablePlugins.push(plugin)
            }
        })

    })
    res.set('Content-Type', 'text/json');
    res.send(availablePlugins);
})

/**
 * receive a folderName of the Plugin, which has to be removed
 */
router.put('/remove', (req, res) => {
    const { folder } = req.body
    const files = fs.readdirSync('./plugins')
    files.forEach(fsFolder => {
        if (fsFolder === folder) {
            fse.remove(`./plugins/${fsFolder}`, function (err) {
                if (err) {
                    console.error(err)
                    res.status(500).send()
                } else {
                    res.status(200).send()
                }
            })
        }
    })
})

module.exports = router