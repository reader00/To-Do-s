/* eslint-disable max-len */
/* eslint object-curly-newline: "off" */

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/client/InvariantError');
const NotFoundError = require('../../exceptions/client/NotFoundError');
const InternalServerError = require('../../exceptions/server/InternalServerError');
const AuthorizationError = require('../../exceptions/client/AuthorizationError');

class ToDoService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyToDoAccess(toDoId, userId) {
        try {
            await this.verifyToDoOwner(toDoId, userId);
        } catch (error) {
            // Later to verify admin access
            throw error;
        }
    }

    async verifyToDoOwner(toDoId, userId) {
        const query = {
            text: 'SELECT * FROM to_dos WHERE id = $1',
            values: [toDoId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('To-do not found!');
        }

        const { user_id: owner } = result.rows[0];
        if (userId !== owner) {
            throw new AuthorizationError('You have no authorization!');
        }
    }

    async addToDo({ name, description }, owner) {
        const id = `todo-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO to_dos(id, user_id, name, description) VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, owner, name, description],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Failed to add To-do');
        }

        return result.rows[0].id;
    }

    async getToDos(owner) {
        const query = {
            text: ` SELECT * FROM to_dos WHERE to_dos.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool
            .query(query)
            .then((fetchResult) => fetchResult)
            .catch((err) => {
                console.log(err.stack);
                throw new InternalServerError('Internal Server Error!');
            });

        return result.rows;
    }

    async getToDoById(id) {
        const query = {
            text: 'SELECT * FROM to_dos WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('To-do not found!');
        }

        return result.rows[0];
    }

    async deleteToDoById(id) {
        const query = {
            text: 'DELETE FROM to_dos WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Failed to delete To-do. Id not found!');
        }
    }
}

module.exports = ToDoService;
