const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/client/InvariantError');
const NotFoundError = require('../../exceptions/client/NotFoundError');
const AuthenticationError = require('../../exceptions/client/AuthenticationError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyUserCredential(email, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE email = $1',
            values: [email],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('The credentials you provided are wrong.');
        }

        const { id, password: hashedPassword } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError(
                'The credentials you provided are wrong.'
            );
        }

        return id;
    }

    async verifyUsername(email) {
        const query = {
            text: 'SELECT email FROM users WHERE email = $1',
            values: [email],
        };

        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantError(
                'Failed to add a user. The email has been used.'
            );
        }
    }

    async addUser({ email, password, fullname }) {
        await this.verifyUsername(email);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 16);
        const query = {
            text: 'INSERT INTO users(id, fullname, email, password, role_id) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, fullname, email, hashedPassword, 2],
        };

        const result = await this._pool.query(query);
        console.log(result);

        if (!result.rowCount) {
            throw new InvariantError('Failed to add a user.');
        }

        return result.rows[0].id;
    }
}

module.exports = UsersService;
