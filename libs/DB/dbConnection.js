const {toLog} = require('../logger.js');
const {connectToMongo, closeMongo} = require('./mongoDB/mongoConnection');
const {connectToFirestore, closeFirestore} = require('./firestore/firestoreConnection');
require('dotenv').config();

async function connectToDB(dbName){
    if (process.env.ENV === 'production') {
        toLog(`Attempting to connect to Firestore`);
        return connectToFirestore(dbName);
    }else {
        toLog(`Attempting to connect to Mongo`);
        return connectToMongo(dbName);
    }
}

async function closeDBConnection() {
    if (process.env.ENV !== 'production') {
        await closeMongo();
    } else {
        await closeFirestore();
    }
}

module.exports = { connectToDB, closeDBConnection };