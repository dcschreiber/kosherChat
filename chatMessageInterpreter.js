let search = require('./productSearch');
const { toLog } = require("./libs/logger");
require('dotenv').config();

// Helper function to format the product object
function formatProduct(product) {
    // Check if product has the structure from Algolia (production)
    if (process.env.ENV === 'production') {
        const productName = product.product || 'No Product Name';
        const brand = product._highlightResult.brand.value.replace(/<[^>]+>/g, '') || 'No Brand Info';
        const category = product._highlightResult.category.value.replace(/<[^>]+>/g, '') || 'No Category Info';
        const kosherStatus = product._highlightResult.kosher.value.replace(/<[^>]+>/g, '') || 'No Kosher Info';

        return `Brand: ${brand}, Category: ${category}, Product: ${productName}, Kosher: ${kosherStatus}`;

    } else {

        // Fallback for local (MongoDB) structure
        const { brand, category, product: productName, kosher } = product;
        return `Brand: ${brand || ""}, Category: ${category || ""}, Product: ${productName || ""}, Kosher: ${kosher || ""}`;
    }

}
// Helper function to join product strings
function joinProductStrings(products) {
    return products.map(formatProduct).join('\n-\n');
}

async function getQueryReply(message) {
    try {
        const results = await search.findProduct(message);
        toLog(`results.products: ${JSON.stringify(results.products)}`);
        return joinProductStrings(results.products);
    } catch (error) {
        toLog(`Error in getQueryReply: ${error.message}`);
        return 'An error occurred, please try again later.';
    }
}

module.exports = { getQueryReply };
