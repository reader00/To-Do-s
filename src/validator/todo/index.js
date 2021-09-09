const InvariantError = require('../../exceptions/client/InvariantError');
const { ToDoPayloadScheme } = require('./scheme');

const ToDoValidator = {
    validateToDoPayload: (payload) => {
        const validationResult = ToDoPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ToDoValidator;
