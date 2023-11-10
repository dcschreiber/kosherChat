const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Working on a Kosher product WhatsApp chat. /n For info please contact daniel@mrvrv.com');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post('/webhook', (req, res) => {
    // Logic to handle incoming messages
    res.status(200).send('Received!');
});
