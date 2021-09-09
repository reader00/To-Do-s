const Joi = require('joi');

const ToDoPayloadScheme = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
});

module.exports = { ToDoPayloadScheme };
