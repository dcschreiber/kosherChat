const {toLog} = require('./logger.js');
const { MongoClient } = require('mongodb');
const { Firestore } = require('@google-cloud/firestore');

let dbClient;

if (process.env.ENV === 'production') {
    // Initialize Firestore for production
    dbClient = new Firestore();
    toLog("Created connection to Firestore DB")
} else {
    // Initialize MongoDB for development
    const uri = "mongodb://localhost:27017";
    dbClient = new MongoClient(uri);
    toLog("Created connection to MongoDB")
}

async function connectToDB(dbName) {
    if (process.env.ENV === 'production') {
        return dbClient;
    } else {
        try {
            await dbClient.connect();
            return dbClient.db(dbName);
        } catch (error) {
            console.error("MongoDB connection failed", error);
            throw error;
        }
    }
}

async function closeDBConnection() {
    if (process.env.ENV !== 'production') {
        try {
            await dbClient.close();
        } catch (error) {
            console.error("MongoDB connection could not be closed", error);
        }
    }
    // No action needed for Firestore as it manages connections automatically
}

module.exports = { connectToDB, closeDBConnection };