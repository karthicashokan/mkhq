const { runRBQuery } = require('./middleware');

async function run() {
    try {
        // Step 1: Create DB (if it doesn't exist already);
        const db = await runRBQuery("CREATE DATABASE IF NOT EXISTS metakeep");

        // Step 2: Create User table (if it doesn't exist already);
        const User = await runRBQuery("CREATE TABLE if not exists User (id INT UNSIGNED NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL,  PRIMARY KEY (id));");

        // Step 3:
        const Application = await runRBQuery("CREATE TABLE if not exists Application (id VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, createdBy INT UNSIGNED NOT NULL, secret VARCHAR(255) NOT NULL, chain ENUM ('ETHEREUM','POLYGON','SOLANA') NOT NULL, PRIMARY KEY (id), FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`));")
    } catch (error) {
        throw error;
    }
}

run()
    .then(() => {
        console.log('DB initialized');
    })
    .catch((error) => {
        console.log('Error with DB initialization', error);
    })
