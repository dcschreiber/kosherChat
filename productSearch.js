const {toLog} = require('./libs/logger.js');
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'kosherLists';
const collectionName = 'KLBD8822';

//This will be the content of the message I receive on WhatsApp
const searchPattern = 'Oreo'; // Replace with the product you're searching for

async function findProduct(productName) {
    let results = { count: 0, products: [] };
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //index:
        //await collection.createIndex({ searchindexboth: "text" });

        const query = { $text: { $search: productName } };

        results.count = await collection.countDocuments(query);
        toLog(`Number of documents that match the query: ${results.count}`);

        if (results.count<10) {
            const productsCursor = collection.find(query);
            results.products = await productsCursor.toArray();
            // toLog(products);
        }else{
            toLog("Please try a more specific query")
        }


    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    return results;
}

module.exports.findProduct = findProduct;