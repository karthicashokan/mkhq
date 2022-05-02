const mysql = require('promise-mysql');
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const DBConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "metakeep",
};

/**
 * Returns a mysql DB connect
 * @returns {Bluebird<Connection>}
 */
const getDbConnection = async () => {
    return mysql.createConnection(DBConfig);
}

/**
 * Runs a SQL Query
 * @param queryString
 * @returns {Promise<*>}
 */
const runRBQuery = async (queryString) => {
    // Open DB connection (Prod code should use ORM, maybe sequelize?)
    const db = await getDbConnection()
    const result = await db.query(queryString);
    // Close DB connection
    await db.end();
    return result;
}

const verifyJwt = async (jwtToken) => {
    // TODO: Move cognito details to config
    const verifier = CognitoJwtVerifier.create({
        userPoolId: 'us-east-2_8H4ACkiao',
        tokenUse: null,
        clientId: '4qgrgm4afe04odl1sp38m6esc3',
    });

    try {
        const payload = await verifier.verify(jwtToken);
        console.log(payload);
        return true;
    } catch (err) {
        return false;
    }
}


module.exports = {
    runRBQuery,
    verifyJwt
}