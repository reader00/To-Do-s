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
}

module.exports = UsersHandler;
