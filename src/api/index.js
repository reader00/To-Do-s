/* eslint-disable camelcase */
const path = require('path');

// Import users plugin
const users = require('./users');
const UsersService = require('../service/postgres/UsersService');
const UsersValidator = require('../validator/users');

// Import authentications plugin
const authentications = require('./authentications');
const AuthenticationsService = require('../service/postgres/AuthenticationsService');
const AuthenticationsValidator = require('../validator/authentications');
const TokenManager = require('../tokenize/TokenManager');

// Import To-do plugin
const todos = require('./todo');
const ToDosService = require('../service/postgres/ToDoService');
const ToDosValidator = require('../validator/todo');

// Import tasks plugin
const tasks = require('./tasks');
const TasksService = require('../service/postgres/TasksService');
const tasksValidator = require('../validator/tasks');

// Import upload plugin
const uploads = require('./uploads');
const StorageService = require('../service/storage/StorageService');
const UploadsValidator = require('../validator/uploads');

// Create instance
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const toDosService = new ToDosService();
const tasksService = new TasksService(toDosService);
const storageService = new StorageService(
    path.resolve(__dirname, './uploads/file/pictures')
);

module.exports = [
    {
        plugin: users,
        options: {
            service: usersService,
            validator: UsersValidator,
        },
    },
    {
        plugin: authentications,
        options: {
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
        },
    },
    {
        plugin: todos,
        options: {
            service: toDosService,
            tasksService,
            validator: ToDosValidator,
        },
    },
    {
        plugin: tasks,
        options: {
            service: tasksService,
            validator: tasksValidator,
        },
    },
    {
        plugin: uploads,
        options: {
            service: storageService,
            usersService,
            validator: UploadsValidator,
        },
    },
];
