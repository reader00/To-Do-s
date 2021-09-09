/* eslint-disable class-methods-use-this */
const autoBind = require('auto-bind');

class TasksHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postTaskHandler(req, h) {
        // const playlistId = this.getPlaylistId(req.params.playlist);
        const { toDoId } = req.params;

        this._validator.validateTaskPayload(req.payload);

        const { name } = req.payload;
        const { id: owner } = req.auth.credentials;

        await this._service.addTask(toDoId, name, owner);

        const res = h.response({
            status: 'success',
            message: 'Task added',
        });
        res.code(201);
        return res;
    }

    async deleteTaskByIdHandler(req, h) {
        const { taskId, any } = req.params;

        const { id: owner } = req.auth.credentials;

        await this._service.deleteTaskById(taskId, owner);

        const res = h.response({
            status: 'success',
            message: 'Task deleted',
        });
        res.code(200);
        return res;
    }
}

module.exports = TasksHandler;
