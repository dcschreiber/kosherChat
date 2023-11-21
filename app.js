const express = require('express');
const app = express();
const { getQueryReply } = require('./chatMessageInterpreter');
const dotenv = require('dotenv');
const {toLog} = require("./libs/logger");
const {sendWhatsappMessage} = require('./whatsappMessageHandling/sendingWhatsappMessage');

dotenv.config();
app.use(express.json());

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

// Webhook authentication
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verify the mode and token sent are correct
    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            toLog('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
            res.send(req.query[challenge]);
        } else {
            toLog("WEBHOOK_NOT_VERIFIED - Verify tokens do not match");
            res.sendStatus(403);
        }
    }
});



app.post('/webhook', async (req, res) => {

    // Extracting Message Content
    const messageText = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    const senderId = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;
    if (!messageText || !senderId) {

        toLog('No text message or sender ID found.', 2);
        return res.status(400).send({ error: 'No text message or sender ID provided' });
    }

    res.status(200).send('Received');
    toLog(`Received a message on webhook with ${messageText}, senderId: ${senderId}.`);

    const replyMessage = await getQueryReply(messageText);
    await sendWhatsappMessage(replyMessage, senderId);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
