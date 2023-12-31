const algoliaSearch = require('algoliasearch');
const {toLog} = require('./libs/logger.js');
const {connectToDB, closeDBConnection} = require('./libs/DB/dbConnection');
const dotenv = require('dotenv');
dotenv.config();

let client, index;
if (process.env.ENV === 'production') {
    client = algoliaSearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
    index = client.initIndex(process.env.YOUR_ALGOLIA_INDEX_NAME);
}

async function searchWithAlgolia(productName) {
    if (!client || !index) {
        throw new Error('Algolia is not configured');
    }
    try {
        const wildcardQuery = `*${productName}*`;
        const searchResults = await index.search(wildcardQuery, {
            attributesToRetrieve: ['product', 'kosherSearchIndex'],
            hitsPerPage: 10,
            // typoTolerance: false,
        });
        return searchResults.hits; // This will return an array of search results
    } catch (error) {
        toLog(`Error in searchWithAlgolia: ${error.message}`);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

async function findProduct(productName) {
    toLog(`Started search for product: ${productName}`);
    let results = {count: 0, products: []};

    try {
        if (process.env.ENV === 'production') {
            const productResults= await searchWithAlgolia(productName);
            results.count = productResults.length;
            if (results.count<=10) {
                results.products = productResults;
            }else{
                results.count = -1;
            }
        } else {
            const db = await connectToDB(process.env.DB_NAME);
            const collection = db.collection(process.env.COLLECTION_NAME);

            const query = {$text: {$search: productName}};
            results.count = await collection.countDocuments(query);

            if (results.count <= 10) {
                results.products = await collection.find(query).toArray();
            } else {
                results.count = -1;
                toLog("Please try a more specific query");
            }
        }
        await closeDBConnection();
    } catch (e) {
        console.error(e);
        toLog(`Error in findProduct: ${e.message}`, 2);
    }

    toLog(`Found product in search. Num of results: ${results.count}`);
    return results;
}

module.exports = {findProduct};
