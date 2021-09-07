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

// Create instance
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();

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
];
