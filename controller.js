const Boom = require('@hapi/boom');
const { runRBQuery, verifyJwt } = require('./middleware');
const { BLOCKCHAINS } = require('./constants');
const uuid4 = require('uuid4');

const supportedBlockchains = Object.keys(BLOCKCHAINS);

/**
 * Creates new application
 * @param request
 * @param h
 * @returns {Promise<undefined|*>}
 */
async function createApplication(request, h) {
    const { authorization: jwtToken } = request.headers;
    const isAuthorized = await verifyJwt(jwtToken);
    const { name = null, chain = null, createdBy = 1 } = request.query;
    const inValidArguments = !name || !chain;
    if (inValidArguments) {
        throw new Error('name and chain are required fields');
    }
    if (!isAuthorized || true) {
        throw new Error('Unauthorized access');
    }
    const isChainSupported = supportedBlockchains.includes(chain.toUpperCase());
    if (!isChainSupported) {
        throw new Error('Unsupported chain');
    }
    try {
        const id = uuid4();
        const secret = uuid4();
        const queryString = `INSERT INTO application (id, secret, name, createdBy, chain) VALUES ('${id}', '${secret}', '${name}', ${createdBy}, '${chain.toUpperCase()}')`;
        const application = await runRBQuery(queryString);
        return h.response({
            id,
            secret,
            chain: chain.toUpperCase(),
            name
        });
    } catch (error) {
        Boom.boomify(error, { statusCode: 400 });
    }
}

/**
 * Lists all applications
 * @param request
 * @param h
 * @returns {Promise<undefined|*>}
 */
async function listApplications(request, h) {
    try {
        const { username = null } = request.query;
        // Step 1: Query to fetch all applications
        let queryToFetchApplicationList = 'SELECT * from application';
        if (username) {
            // Step 2: If URL request has the username query param, then filter by username
            // Step 2a: First fetch the correct user based on username
            const user = await runRBQuery(`SELECT * from user where username='${username}'`);
            const userObject = JSON.parse(JSON.stringify(user));
            if (userObject && userObject.id) {
                // Step 2b: Modify queryToFetchApplicationList to filter by userId
                queryToFetchApplicationList += ` WHERE createdBy = '${userObject.id}'`;
            }
        }
        // Step 3: Run query to fetch all applications
        const results = await runRBQuery(queryToFetchApplicationList);
        return h.response(results);
    } catch (error) {
        // Step 4: In case of errors return 400 error
        Boom.boomify(error, { statusCode: 400 });
    }
}

module.exports = {
    createApplication,
    listApplications
}