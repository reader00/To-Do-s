const autoBind = require('auto-bind');

class ToDoHandler {
    constructor(service, tasksService, validator) {
        this._service = service;
        this._tasksService = tasksService;
        this._validator = validator;

        autoBind(this);
    }

    async postToDoHandler(req, h) {
        console.log(req.payload);
        this._validator.validateToDoPayload(req.payload);
        const { id: owner } = req.auth.credentials;

        const toDoId = await this._service.addToDo(req.payload, owner);

        const res = h.response({
            status: 'success',
            message: 'To-do added',
            data: {
                toDoId,
            },
        });
        res.code(201);
        return res;
    }

    async getToDosHandler(req) {
        const { id: owner } = req.auth.credentials;

        const toDo = await this._service.getToDos(owner);
        return {
            status: 'success',
            data: {
                toDo,
            },
        };
    }

    async getToDoByIdHandler(req) {
        const { toDoId } = req.params;
        const { id: owner } = req.auth.credentials;

        const { id, user_id, name, description } =
            await this._service.getToDoById(toDoId);
        const tasks = await this._tasksService.getTasks(toDoId, owner);

        return {
            status: 'success',
            data: {
                id,
                user_id,
                name,
                description,
                tasks: tasks.map((e) => {
                    return {
                        id: e.id,
                        name: e.name,
                        status: e.status ? 'done' : 'todo',
                    };
                }),
            },
        };
    }

    async deleteToDoByIdHandler(req, h) {
        const { toDoId } = req.params;
        const { id: owner } = req.auth.credentials;

        await this._service.verifyPlaylistOwner(toDoId, owner);
        await this._service.deletePlaylistById(toDoId);

        const res = h.response({
            status: 'success',
            message: 'To-do deleted',
        });
        res.code(200);
        return res;
    }
}

module.exports = ToDoHandler;
