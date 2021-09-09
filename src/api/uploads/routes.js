const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/pictures',
        handler: handler.postUploadUserPhotoProfileHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 1000 * 500, // 500kb
            },
            auth: 'todo_list_strategy',
        },
    },
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file'),
            },
        },
    },
];

module.exports = routes;
