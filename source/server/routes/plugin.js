"use strict"

const express = require('express')
const fs = require("fs");
const fse = require('fs-extra')
let router = express.Router()

/**
 * send all Plugins, which are "installed"
 */
router.get('/init', (req, res) => {
    const existPlugins = []
    const exPluginFiles = fs.readdirSync('./plugins')
    exPluginFiles.forEach(folder => {
        fs.readdirSync(`./plugins/${folder}`).forEach(plugin => {
            if(plugin === 'plugin.js') {
                const Plugin = require(`../../plugins/${folder}/plugin.js`)
                const plugin = new Plugin()
                initPlugin(folder)
                existPlugins.push(plugin.toClient())
            }
        })
    })
    res.set('Content-Type', 'text/json');
    res.status(200).send(existPlugins)
})

/**
 * This Function initialize the endpoints of the Plugin. The Plugin has a pathes object, which attribute is the function,
 * which has to be called by the endpoint. At this Point are only get Calls possible, but with a small amount of work
 * the pathes Object can contain the method.
 * @param {String} folder
 */
function initPlugin(folder) {
    const Plugin = require(`../../plugins/${folder}/plugin.js`)
    const plugin = new Plugin()
    for (const path in plugin.pathes){
        const func = plugin.pathes[path]
        router.get(`/${plugin.pathPrefix}/${path}`, (req, res) => {func(req,res)})
    }
}

/**
 * This Endpoint copy the Plugin form available to plugins
 */
router.put('/install', (req, res) => {
    const { folder } = req.body
    const files = fs.readdirSync('./availablePlugins')
    files.forEach(fsFolder => {
        if (fsFolder === folder) {
            const source =`./availablePlugins/${fsFolder}`
            const destination = `./plugins/${fsFolder}`
            fse.copy(source, destination, function (err) {
                if (err) {
                    console.error(err)
                    res.status(500).send()
                } else {
                    initPlugin(folder)
                    res.status(200).send()
                }

            })
        }
    })
})

module.exports = router