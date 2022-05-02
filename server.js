const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const Joi = require('@hapi/joi');

const port = 3001;
const server = Hapi.server({
    port,
    host: 'localhost'
});

routes.forEach((route) => {
    server.route(route);
});

const start = async () => {
    await server.start();
};

// Start HAPI server
start()
    .then(() => {
        console.log('Server started at ', port);
    })
    .catch((error) => {
        console.log('Error encountered with server', error);
    })