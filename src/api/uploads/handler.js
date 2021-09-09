const autoBind = require('auto-bind');

class UploadsHandler {
    constructor(service, usersService, validator) {
        this._service = service;
        this._validator = validator;
        this._usersService = usersService;

        autoBind(this);
    }

    async postUploadUserPhotoProfileHandler(request, h) {
        const { data } = request.payload;
        const { id: owner } = request.auth.credentials;
        this._validator.validateImageHeaders(data.hapi.headers);

        const filename = await this._service.writeFile(
            data,
            data.hapi,
            '\\profile'
        );
        const pictureUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/profile/${filename}`;

        await this._usersService.updatePhotoProfile(pictureUrl, owner);

        const response = h.response({
            status: 'success',
            data: {
                pictureUrl,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;
