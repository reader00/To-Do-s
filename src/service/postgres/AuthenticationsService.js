const { Pool } = require('pg');
const InvariantError = require('../../exceptions/client/InvariantError');

class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Refresh token is not valid');
        }
    }

    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO authentications(token) VALUES($1)',
            values: [token],
        };

        await this._pool.query(query);
    }

    async deleteRefreshToken(token) {
        await this.verifyRefreshToken(token);

        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthenticationsService;
