const knex = require("knex");
const path = require("path");

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: path.join(__dirname, 'gruppe2.db')
    },
    useNullAsDefault: true
});

module.exports = connectedKnex;