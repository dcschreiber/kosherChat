const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'kosherLists'; // Your specified database name
const collectionName = 'KLBD8822'; // Your specified collection name

fs.readFile('rawJsonKLBD8822.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    try {
        let jsonData = JSON.parse(data);
        let jsonKLBDArray = jsonData[0].contents;

        // Data cleaning process
        jsonKLBDArray = jsonKLBDArray.map(entry => {
            Object.keys(entry).forEach(key => {
                if (entry[key] === '1') entry[key] = 1;
                else if (entry[key] === '0') entry[key] = 0;
            });
            return entry;
        });

        // Connect to MongoDB and insert data
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the data array to MongoDB
        const insertResult = await collection.insertMany(jsonKLBDArray);
        console.log(`${insertResult.insertedCount} documents were inserted`);

    } catch (error) {
        console.error('Error processing JSON file or writing to MongoDB:', error);
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
});