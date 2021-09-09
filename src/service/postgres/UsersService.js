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

    async verifyEmailAndUsername(email, username) {
        const query = {
            text: 'SELECT email, username FROM users WHERE email = $1 OR username = $2',
            values: [email, username],
        };

        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantError(
                'Failed to add a user. The email or username has been used.'
            );
        }
    }

    async addUser({ email, password, username }) {
        await this.verifyEmailAndUsername(email, username);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 16);
        const query = {
            text: 'INSERT INTO users(id, username, email, password, role_id) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, username, email, hashedPassword, 2],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Failed to add a user.');
        }

        return result.rows[0].id;
    }
}

module.exports = UsersService;
