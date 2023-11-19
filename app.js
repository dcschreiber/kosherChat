const express = require('express');
const app = express();
const { getQueryReply } = require('./chatMessageInterpreter');
const dotenv = require('dotenv');
const {toLog} = require("./libs/logger");
const axios = require('axios');
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
        const response = await getQueryReply(message);
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

    // Verify the mode and token sent are correct
    if (mode && token) {
        // Checks if the mode is 'subscribe' and the token is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            // res.status(200).send(challenge);
            res.send(req.query[challenge]);
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

    // Extracting the message text and sender ID
    const messageText = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    const senderId = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;

    toLog(`MessageText ${messageText}, senderId: ${senderId}.`);

    if (!messageText || !senderId) {
        console.log('No text message or sender ID found.');
        return res.status(400).send({ error: 'No text message or sender ID provided' });
    }

    // Process the message and get a reply
    try {
        const replyMessage = await getQueryReply(messageText);

        // Send the reply back to the WhatsApp API
        await axios({
            method: 'post',
            url: `https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            data: {
                messaging_product: "whatsapp",
                to: senderId,
                type: "text",
                text: { body: replyMessage }
            },
        });

        res.status(200).send('Reply sent to WhatsApp');
    } catch (error) {
        console.error(`Error in processing and replying: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
});