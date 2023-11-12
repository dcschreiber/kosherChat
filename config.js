const localConfig = {
    dbURI: 'mongodb://localhost:27017', // Replace with your local MongoDB URI

    // other local configurations
};

const productionConfig = {
    // Production configurations, such as Firestore credentials
    // No need for a dbURI since Firestore uses a different method for connection
};

const config = process.env.ENV === 'production' ? productionConfig : localConfig;

module.exports = config;
