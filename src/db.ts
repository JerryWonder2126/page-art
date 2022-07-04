import {Client} from 'pg';

const sslOptions = {
  rejectUnauthorized: false,
};

const client: Client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DEVELOPMENT_MODE ? false : sslOptions,
});

client.connect().then(() => console.log('Connected'));

export {client};
