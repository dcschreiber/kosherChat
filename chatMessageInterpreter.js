let search = require('./productSearch');
const { toLog } = require("./libs/logger");
require('dotenv').config();
const {cleanFirestoreResults} = require('./libs/DB/firestore/firestoreQuering')
const {cleanMongoResults} = require('./libs/DB/mongoDB/mongoQuering')


async function getQueryReply(message) {
    try {
        const results = await search.findProduct(message);
        if (results.count === -1){
            toLog(`Too many results`);
            return `Too many results. Try a more specific search.`;
        }else if (process.env.ENV === 'production') {
            return cleanFirestoreResults(results.products);
        }else {
            return cleanMongoResults(results.products);
        }
    } catch (error) {
        toLog(`Error in getQueryReply: ${error.message}`);
        return 'An error occurred, please try again later.';
    }
}

module.exports = { getQueryReply };
