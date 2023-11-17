// Helper function to format the product object
function formatProduct(product) {
    const { brand, category, product: productName, kosher } = product;
    return `Brand: ${brand || ""}, Category: ${category || ""}, Product: ${productName || ""}, Kosher: ${kosher || ""}`;
}

// Helper function to join product strings
function joinProductStrings(products) {
    return products.map(formatProduct).join('\n-\n');
}

let search = require('./productSearch');
const { toLog } = require("./libs/logger");

async function getQueryReply(message) {
    try {
        const results = await search.findProduct(message);
        toLog(`results.products: ${JSON.stringify(results.products)}`);
        return joinProductStrings(results.products);
    } catch (error) {
        // Log the error and return a custom message
        toLog(`Error in getQueryReply: ${error.message}`);
        return { error: 'An error occurred, please try again later.' };
    }
}

module.exports = { getQueryReply };