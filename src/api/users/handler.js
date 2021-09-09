const autoBind = require('auto-bind');

class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postUserHandler(req, h) {
        await this._validator.validateUserPayload(req.payload);
        console.log(req.payload);

        const userId = await this._service.addUser(req.payload);

        const res = h.response({
            status: 'success',
            message: 'Successfully added user.',
            data: {
                userId,
            },
        });

        res.code(201);
        return res;
    }

    async getUserProfileHandler(req, h) {
        const { id: owner } = req.auth.credentials;
        return this.getUserById(req, h, owner);
    }

    async getUserById(req, h, owner = false) {
        const id = owner ? owner : req.params.userId;
        const user = await this._service.getUserById(id);
        console.log('asd', user);
        const res = h.response({
            status: 'success',
            data: {
                user,
            },
        });

        res.code(200);
        return res;
    }
}

module.exports = UsersHandler;
