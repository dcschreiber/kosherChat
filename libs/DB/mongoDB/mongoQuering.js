
function formatProduct(product) {
    const {brand, category, product: productName, kosher} = product;
    return `Brand: ${brand || ""}, Category: ${category || ""}, Product: ${productName || ""}, Kosher: ${kosher || ""}`;
}

function joinProductStrings(products) {
    return products.map(formatProduct).join('\n-\n');
}

module.exports = {cleanMongoResults : joinProductStrings};