const routes = (handler) => [
    {
        method: 'POST',
        path: '/tasks/{toDoId}',
        handler: handler.postTaskHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
    {
        method: 'PUT',
        path: '/tasks/{taskId}',
        handler: handler.putTaskStatusHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
    {
        method: 'DELETE',
        path: '/tasks/{taskId}',
        handler: handler.deleteTaskByIdHandler,
        options: {
            auth: 'todo_list_strategy',
        },
    },
];

module.exports = routes;
