const InvariantError = require('../../exceptions/client/InvariantError');
const { TaskPayloadScheme } = require('./scheme');

const TasksValidator = {
    validateTaskPayload: (payload) => {
        const validationResult = TaskPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = TasksValidator;
