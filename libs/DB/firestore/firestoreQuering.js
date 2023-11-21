function formatProduct(product) {
    const productName = product[product] || 'No Product Name';
    const brand = product._highlightResult.brand.value.replace(/<[^>]+>/g, '') || 'No Brand Info';
    const category = product._highlightResult.category.value.replace(/<[^>]+>/g, '') || 'No Category Info';
    const kosherStatus = product._highlightResult.kosher.value.replace(/<[^>]+>/g, '') || 'No Kosher Info';

    return `Brand: ${brand}, Category: ${category}, Product: ${productName}, Kosher: ${kosherStatus}`;

}

// Helper function to join product strings
function joinProductStrings(products) {
    return products.map(formatProduct).join('\n-\n');
}

module.exports = {cleanFirestoreResults : joinProductStrings};