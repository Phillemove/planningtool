/**
 * Starts the Server itself. Entrypoint for startup.
 * use "npm install" to install all required modules
 * run server using "npm run test" (this allows for continues workflow and will enable continues integration when implemented)
 */

const express = require('express');
const fs = require("fs");
const db = require('../Database/db_operations');

const server = express();

// Server instance shall only be started if not already running
server.running = false;
// is the running server instance that gets exported
server.runningInstance = null;

server.start = async function () {
    if (!server.running) {
        // init Database if non exists
        await checkDatabase();
        server.running = true;

        // Inport Models
        const todo = require('./routes/todo')
        const contact = require('./routes/contact')
        const appointment = require('./routes/appointment')
        const shop = require('./routes/shop')
        const plugin = require('./routes/plugin')
        const file = require("./routes/file");
        const log = require("./routes/log");


        // ServerData
        const PORT = 8023;
        const HOST = 'localhost';

        server.use(express.urlencoded({extended: false}))
        server.use(express.json())

        // automates delivery of all skripts contained in "./view/static"
        server.use(express.static('./view/static'));

        // index will be returned when root is called in Browser. All other scripts in "/html/index.html"
        // and "/css/styles.css" can be accesd using their name.
        server.use(express.static('./view/static/html'));
        server.use(express.static('./plugins'))
        server.use(express.static('./availablePlugins'))

        // First argument specifies path which will be handeld by the module passed as the second argument.
        server.use('/todo', todo)
        server.use('/contact', contact)
        server.use('/appointment', appointment)
        server.use('/shop', shop)
        server.use('/plugin', plugin)
        server.use('/file', file);
        server.use('/log', log);

        // initates Plugins found in plugin - folder
        server.initiatePlugins();

        // Starting up server
        server.runningInstance = await server.listen(PORT, HOST, () => {
            console.log("Server is listening on: " + HOST + ":" + PORT);
        });
    }
}

server.shutdown = async function () {
    setTimeout(() => {
        server.runningInstance.close(() => {
            console.log("Server is preparing to shut down.");
            server.running = false;
            db.closeDB().then(() => {
                console.log("Database is succesfull disconnected.");
                console.log("Server is shutting down now.");
                process.exit();
            }).catch(e => {
                console.log("Server could not be shut down due to problems disconnecting the Database.")
                console.log(e);
            });
        });
    }, 0);
}

//TODO: look for specification in test/server/server.spec.js -> testfirst development. left in for Demo purpose
server.validatePluginJSForInitilation = function (Plugin) {
    return true;
}

server.initiatePlugins = function () {
    if (!fs.existsSync('./plugins')) {
        fs.mkdirSync('./plugins', {recursive: true})
    }
    const exPluginFiles = fs.readdirSync('./plugins')
    exPluginFiles.forEach(folder => {
        fs.readdirSync(`./plugins/${folder}`).forEach(plugin => {
            if (plugin === 'plugin.js') {
                const Plugin = require(`../plugins/${folder}/plugin.js`)
                if (server.validatePluginJSForInitilation(Plugin)) {
                    const plugin = new Plugin()
                    for (const path in plugin.pathes) {
                        // console.log(`pathPrefix: ${plugin.pathPrefix}, path: ${path}`)
                        const func = plugin.pathes[path]
                        // console.log(func)
                        server.get(`/plugin/${plugin.pathPrefix}${path}`, (req, res) => {
                            func(req, res)
                        })
                    }
                } else {
                    // TODO - implent what shall be done if validatePluginForInitilation() = false;
                }
            }
        })
    })
}

//Überprüft Repository um Datenbank zu prüfen und ggf Tabellen zu erstellen
async function checkDatabase() {
    console.log("Check Database");
    await db.createTables();
    console.log("Database checked, all tables created");
}

// listener for SIGTERM SIGINT - Signals which will be send when the process is requested to be terminated
// SIGTERM signal is sent to a process to request its termination
process.on('SIGTERM', server.shutdown)
//SIGINT : gets send when a user interrupts the process in the terminal context
process.on('SIGINT', server.shutdown);

server.start();
exports.module = server;

/*
Hierbei handelt es sich um den Server, welcher die Ansprechstelle für die Schnittstelle ist. Dieser hat eine IP-Adresse,
mit welcher er ansprechbar ist. Alternativ wird sich bei der Schnittstelle mit fixer Adresse und mit eigener Nutzer-ID
angemeldet. Somit weiß dieser die Ansprechadresse. Dann gibt es während der eigene NodeJS Server läuft ein alive-Signal
in vorgegebener Zeit. Dieser Server würde jede Collection kennen, damit man bei eingehenden Objekten (z.B. ToDo) dementsprechend
das auch so abspeichern kann.
das auch so abspeichern kann.

const server2 = express();

const PORT2 = X;
const HOST2 = 'X.X.X.X';

server2.use(express.urlencoded({extended: false}))
server2.use(express.json())


server2.listen(PORT2, HOST2, () => {
    console.log("Server is listening on: " + HOST + ":" + PORT);
});

getStoredInformations();


function getStoredInformations() {
    fetch('Schnittstelle')
        .then(data => {
            //Handhabung der Daten. Denkbar wäre auch eine Unterscheidung in ToDo/Appointment/Contact als einzelne Endpunkte
            //Aber da diese nicht existieren, ist es hier nur soweit gedachte Ansätze
        }
}

 */