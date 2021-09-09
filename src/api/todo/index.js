const ToDosHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'todo',
    version: '1.0.0',
    register: async (server, { service, tasksService, validator }) => {
        const toDosHandler = new ToDosHandler(service, tasksService, validator);
        server.route(routes(toDosHandler));
    },
};
