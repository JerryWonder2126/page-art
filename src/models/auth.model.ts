import {client} from '../db';
import {IUser} from '../helpers/general.interface';
import bcrypt from 'bcrypt';
// const bcrypt = require('bcrypt');

class Users {
  constructor(private table = 'users') {}

  async create(email: string, password: string) {
    try {
      const hashed_password = await this.hashPassword(password);
      const query = `INSERT INTO ${this.table} (email, password) VALUES ('${email}', '${hashed_password}')`;
      const response = await client.query(query);
      return response.rows[0] as IUser;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async exists(email: string) {
    const query = `select exists(select 1 from ${this.table} where email='${email}')`;
    const response = await client.query(query);
    return response.rows[0].exists as boolean;
  }

  async get(email: string) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE email='${email}'`;
      const response = await client.query(query);
      return response.rows[0] as IUser;
    } catch {
      throw new Error(`User identified with ${email} not found.`);
    }
  }

  async hashPassword(password: string) {
    try {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);
      return hashed as string;
    } catch (err) {
      throw new Error('Provided password can not be used');
    }
  }

  async verify(email: string, password: string) {
    let passwordValid = false;
    try {
      const userExists = await this.exists(email);
      if (!userExists) {
        throw new Error(`User identified with ${email} not found.`);
      }
      const user = await this.get(email);
      passwordValid = await bcrypt.compare(password, user.password);
    } catch (err: any) {
      throw Error(err.message);
    }
    return passwordValid;
  }

  setAccessToken = async (email: string, token: string) => {
    try {
      const userExists = this.exists(email);
      if (!userExists) {
        throw Error(`User identified with ${email} not found.`);
      }
      const query = `UPDATE users SET token='${token}' WHERE email='${email}'`;
      await client.query(query);
    } catch (err: any) {
      throw Error(err.message);
    }
  };

  getAccessToken = async (email: string) => {
    const userExists = this.exists(email);
    if (!userExists) {
      throw Error(`User identified with ${email} not found.`);
    }
    const query = `SELECT token FROM users WHERE email='${email}'`;
    const response = await client.query(query);
    return (response.rows[0] as IUser).token;
  };
}

export default new Users();
