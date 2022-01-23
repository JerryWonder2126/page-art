"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var pg_1 = require("pg");
var client;
exports.client = client;
if (process.env.DATABASE_URL) {
    exports.client = client = new pg_1.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}
else {
    exports.client = client = new pg_1.Client({
        user: process.env.PGUSER || 'localhost',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'artpage',
        password: process.env.PGPASS || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
    });
}
client.connect();
//# sourceMappingURL=db.js.map