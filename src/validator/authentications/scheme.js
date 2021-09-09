const Joi = require('joi');

const PostAuthenticationScheme = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
}).or('username', 'email');

const PutAuthenticationScheme = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationScheme = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    PostAuthenticationScheme,
    PutAuthenticationScheme,
    DeleteAuthenticationScheme,
};
