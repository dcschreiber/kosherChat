const { toLog } = require('./libs/logger.js');
const { connectToDB, closeDBConnection } = require('./libs/dbConnection');

const dbName = 'kosherLists';
const collectionName = 'KLBD8822';

async function findProduct(productName) {
    let results = { count: 0, products: [] };
    let db, collection;

    try {
        db = await connectToDB(dbName);

        if (process.env.ENV === 'production') {
            // Firestore-specific logic
            collection = db.collection(collectionName);
            // Perform the query
            const querySnapshot = await collection.where('product', '==', productName).limit(10).get();

            // Check the size of the results
            if (querySnapshot.size > 10) {
                toLog("Please try a more specific query");
            } else {
                querySnapshot.forEach((doc) => {
                    results.products.push(doc.data());
                });
                results.count = results.products.length;
                toLog(`productSearch: Number of documents that match the query: ${results.count}`);
            }

        } else {
            // MongoDB-specific logic
            collection = db.collection(collectionName);

            const query = { $text: { $search: productName } };
            results.count = await collection.countDocuments(query);
            toLog(`Number of documents that match the query: ${results.count}`);

            if (results.count < 10) {
                const productsCursor = collection.find(query);
                results.products = await productsCursor.toArray();
            } else {
                toLog("Please try a more specific query");
            }
        }
    } catch (e) {
        console.error(e);
        toLog(`Error in findProduct: ${e.message}`);
    } finally {
        await closeDBConnection();
    }

    return results;
}

module.exports.findProduct = findProduct;
