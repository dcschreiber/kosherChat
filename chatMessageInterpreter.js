let search = require('./productSearch');
const {toLog} = require("./libs/logger");

async function getQueryReply(message) {
    try {
        const results = await search.findProduct(message);
        return results.products;
    } catch (error) {
        // Log the error and return a custom message
        toLog(`Error in newMessage: ${error.message}`);
        return {error: 'An error occurred, please try again later.'};
    }
}

module.exports = { getQueryReply };
