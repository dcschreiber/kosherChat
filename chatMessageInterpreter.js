let search = require('./productSearch');

async function newMessage(message) {
    const results = await search.findProduct(message);
    return results.products;
}

const message = "oreo";
newMessage(message).then(console.log).catch(console.error);
