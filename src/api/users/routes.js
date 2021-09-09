const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler,
    },
    {
        method: 'GET',
        path: '/users/profile',
        handler: handler.getUserProfileHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
];

module.exports = routes;
