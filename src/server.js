// Import environtment variable from '.env' using dotenv
require('dotenv').config();

// Import Hapi package
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// Import api as plugins
const plugins = require('./api');

// Import strategy for JWT authentications
const { jwtStrategy } = require('./strategy');

// Import error handler
const { errorHandler } = require('./ext');

const init = async () => {
    // Create server
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Register JWT(authentications)
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // Set JWT strategy
    await server.auth.strategy('todo_list_strategy', 'jwt', jwtStrategy);

    // Register plugins
    await server.register(plugins);

    // Set onPreResponse for error handler
    await server.ext('onPreResponse', errorHandler);

    // Start server
    await server.start();
    console.log(`
    |--------------------------------------------------------
    |
    |
    |       Server running on ${server.info.uri}
    |
    |
    |--------------------------------------------------------`);
};

init();
