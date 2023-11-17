let search = require('./productSearch');
const { toLog } = require("./libs/logger");

async function getQueryReply(message) {
    try {
        const results = await search.findProduct(message);
        // Map over the products and create a string for each product with selected fields
        return  replyMessage = results.products.map(product => {
            return `Product: ${product.product}, Brand: ${product.brand}, Category: ${product.category}, Kosher: ${product.kosher}`;
        }).join('\n'); // Join each product string with a newline for readability

    } catch (error) {
        toLog(`Error in getQueryReply: ${error.message}`);
        return 'An error occurred, please try again later.';
    }
}

module.exports = { getQueryReply };
