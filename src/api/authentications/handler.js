const autoBind = require('auto-bind');

class AuthenticationsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postAuthenticationHandler(req, h) {
        this._validator.validatePostAuthenticationPayload(req.payload);
        const { email, password } = req.payload;
        const id = await this._usersService.verifyUserCredential(
            email,
            password
        );

        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });

        await this._service.addRefreshToken(refreshToken);

        const res = h.response({
            status: 'success',
            message: 'Successfully added authentication',
            data: {
                accessToken,
                refreshToken,
            },
        });

        res.code(201);
        return res;
    }

    async putAuthenticationHandler(req) {
        this._validator.validatePutAuthenticationPayload(req.payload);

        const { refreshToken } = req.payload;

        await this._service.verifyRefreshToken(refreshToken);
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({ id });

        return {
            status: 'success',
            message: 'Successfully updated Access Token',
            data: {
                accessToken,
            },
        };
    }

    async deleteAuthenticationHandler(req) {
        this._validator.validateDeleteAuthenticationPayload(req.payload);

        const { refreshToken } = req.payload;

        await this._service.verifyRefreshToken(refreshToken);
        await this._service.deleteRefreshToken(refreshToken);

        return {
            status: 'success',
            message: 'Successfully removed Access Token',
        };
    }
}

module.exports = AuthenticationsHandler;
