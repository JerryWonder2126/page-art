import {Client} from 'pg';

const client = new Client({
  user: process.env.PGUSER || 'localhost',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'artpage',
  password: process.env.PGPASS || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
});

client.connect();
// .then(() => console.log('Connected'))
// .catch(err => console.log(err));

export {client};
