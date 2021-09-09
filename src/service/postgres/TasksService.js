const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/client/InvariantError');
const InternalServerError = require('../../exceptions/server/InternalServerError');

class TasksService {
    constructor(toDosService) {
        this._pool = new Pool();
        this._toDosService = toDosService;
    }

    async addTask(toDoId, name, owner) {
        // Is user have access to To-do
        await this._toDosService.verifyToDoOwner(toDoId, owner);

        // Is To-do exist
        await this._toDosService.getToDoById(toDoId);

        const id = `task-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO tasks(id, to_do_id, name, status) VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, toDoId, name, false],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Failed to add task!');
        }
    }

    async getTasks(toDoId, owner) {
        // Is user have access to playlist
        await this._toDosService.verifyToDoAccess(toDoId, owner);

        const query = {
            text: `SELECT * FROM tasks WHERE to_do_id = $1`,
            values: [toDoId],
        };

        const result = await this._pool
            .query(query)
            .then((fetchResult) => fetchResult)
            .catch((err) => {
                console.log(err.stack);
                throw new InternalServerError('Internal server error!');
            });

        return result.rows;
    }

    async updateTaskStatus(taskId, status, owner) {
        // Is user have access to To-do
        // await this._toDosService.verifyToDoOwner(toDoId, owner);

        const query = {
            text: 'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING id, name, status',
            values: [status, taskId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError(
                'Failed to change task status. Id not found'
            );
        }

        return result.rows[0];
    }

    async deleteTaskById(taskId, owner) {
        // Is user have access to To-do
        // await this._toDosService.verifyToDoOwner(toDoId, owner);

        const query = {
            text: 'DELETE FROM tasks WHERE id = $1',
            values: [taskId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Failed to delete task. Id not found');
        }
    }
}

module.exports = TasksService;
