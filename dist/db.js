"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var pg_1 = require("pg");
var sslOptions = {
    rejectUnauthorized: false,
};
var client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DEVELOPMENT_MODE ? false : sslOptions,
});
exports.client = client;
client.connect().then(function () { return console.log('Connected'); });
//# sourceMappingURL=db.js.map