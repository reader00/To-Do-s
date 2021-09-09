const routes = (handler) => [
    {
        method: 'POST',
        path: '/todos',
        handler: handler.postToDoHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
    {
        method: 'GET',
        path: '/todos',
        handler: handler.getToDosHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
    {
        method: 'GET',
        path: '/todos/{toDoId}',
        handler: handler.getToDoByIdHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
    {
        method: 'DELETE',
        path: '/todos/{toDoId}',
        handler: handler.deleteToDoByIdHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
];

module.exports = routes;
