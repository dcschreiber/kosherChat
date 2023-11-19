// Helper function to format the product object
function formatProduct(product) {
    // Check if product has the structure from Algolia (production)
    if (process.env.ENV !== 'production') {
        const brand = product._highlightResult.brand?.value.replace(/<em>|<\/em>/g, '') || "";
        const category = product._highlightResult.category?.value.replace(/<em>|<\/em>/g, '') || "";
        const productName = product._highlightResult.product?.value.replace(/<em>|<\/em>/g, '') || "";
        const kosher = product._highlightResult.kosher?.value || "";

        return `Brand: ${brand}, Category: ${category}, Product: ${productName}, Kosher: ${kosher}`;
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

let search = require('./productSearch');
const { toLog } = require("./libs/logger");

async function getQueryReply(message) {
    try {
        const results = await search.findProduct(message);
        toLog(`results.products: ${JSON.stringify(results.products, null, 2)}`);
        return joinProductStrings(results.products);
    } catch (error) {
        toLog(`Error in getQueryReply: ${error.message}`);
        return { error: 'An error occurred, please try again later.' };
    }
}

module.exports = { getQueryReply };
