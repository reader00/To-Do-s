const Joi = require('joi');

const UserPayloadScheme = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
});

module.exports = { UserPayloadScheme };
