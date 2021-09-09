const Joi = require('joi');

const TaskPayloadScheme = Joi.object({
    name: Joi.string().required(),
});

module.exports = { TaskPayloadScheme };
