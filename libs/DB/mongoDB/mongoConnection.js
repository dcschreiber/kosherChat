const {toLog} = require('../../logger.js');
require('dotenv').config();

if (process.env.ENV !== 'production') {
    MongoClient = require('mongodb').MongoClient;
}
let dbClient;
if (process.env.ENV !== 'production') {
    const uri = process.env.MONGO_URI;
    dbClient = new MongoClient(uri);
    toLog("Created connection to MongoDB")
}
async function connectToDB(dbName) {
    try {
        await dbClient.connect();
        return dbClient.db(dbName);
    } catch (error) {
        console.error("MongoDB connection failed", error);
        throw error;
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
}

module.exports = {connectToMongo: connectToDB, closeMongo: closeDBConnection};