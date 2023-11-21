const {toLog} = require('../../logger.js');
require('dotenv').config();

const { Firestore } = require('@google-cloud/firestore');
let dbClient;

if (process.env.ENV === 'production') {
    dbClient = new Firestore();
    toLog("Created connection to Firestore DB")
}

async function connectToDB() {
        return dbClient;
}

async function closeDBConnection() {
        toLog(`Firestore connection close request. No need. Nothing happened`)
    }

module.exports = { connectToFirestore:connectToDB, closeFirestore:closeDBConnection };