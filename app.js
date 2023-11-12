const express = require('express');
const app = express();
const { newMessage } = require('./chatMessageInterpreter');


app.use(express.json()); // To parse JSON body

app.post('/new-message', async (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).send({ error: 'Message is required' });  // Directly sending the response
    }

    try {
        const response = await newMessage(message);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


app.get('/', (req, res) => {
    res.send('Working on a Kosher product WhatsApp chat. /n For info please contact daniel@mrvrv.com');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post('/webhook', (req, res) => {
    // Logic to handle incoming messages
    res.status(200).send('Received!');
});
