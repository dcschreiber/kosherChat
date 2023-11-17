const express = require('express');
const app = express();
const { newMessage } = require('./chatMessageInterpreter');
const dotenv = require('dotenv');
const {toLog} = require("./libs/logger");
// const {toLog} = require("./libs/logger");

dotenv.config(); // Load environment variables from .env

app.use(express.json()); // To parse JSON body

// Define your verify token as an environment variable
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.post('/new-message', async (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).send({ error: 'Message is required' });
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

app.get('/webhook', (req, res) => {
    // WhatsApp will send a GET request to verify the webhook with a challenge parameter
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    toLog(`get webhook was called. hub.mode: ${mode}, hub.verify_token: ${token}, hub.challenge: ${challenge}`)

    // Verify the mode and token sent are correct
    if (mode && token) {
        // Checks if the mode is 'subscribe' and the token is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post('/webhook', async (req, res) => {
    let message;
    if (req.body.Body) {
        message = req.body.Body;
        console.log('Found message in Body');
    } else if (req.body.message) {
        message = req.body.message;
        console.log('Found message in message');
    } else if (req.body.Message) {
        message = req.body.Message;
        console.log('Found message in Message');
    }

    if (!message) {
        console.log('No message payload found.');
        return res.status(400).send({ error: 'No message provided' });
    }

    try {
        const response = await newMessage(message);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});