const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post('/webhook', (req, res) => {
    // Logic to handle incoming messages
    res.status(200).send('Received!');
});
