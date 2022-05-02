const Joi = require('@hapi/joi');
const { BLOCKCHAINS } = require('./constants');
const controller = require('./controller');
// Get the list of currently supported blockchains (support both uppercase and lowercase)
const supportedBlockchains = [...Object.keys(BLOCKCHAINS), ...Object.keys(BLOCKCHAINS).map(key => key.toLowerCase())];

module.exports = [
    {
        method: "GET",
        path: "/createApplication",
        options: {
            cors: {
                origin: ['*'],
            },
            validate: {
                query: Joi.object({
                    name: Joi.string().required(),
                    chain: Joi.string().required().valid(...supportedBlockchains),
                })
            }
        },
        handler: controller.createApplication,
    },
    {
        method: "GET",
        path: "/listApplications",
        options: {
            cors: {
                origin: ['*'],
            },
            validate: {
                query: Joi.object({
                    username: Joi.string()
                })
            }
        },
        handler: controller.listApplications,
    },
];