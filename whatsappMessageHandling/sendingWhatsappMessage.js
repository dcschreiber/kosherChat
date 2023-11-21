const axios = require("axios");
const {toLog} = require("../libs/logger");
const dotenv = require('dotenv');
dotenv.config();

async function sendWhatsappMessage(replyMessage, senderId) {
    toLog(`Starting sending of whatsapp message: ${replyMessage}, Sender: ${senderId}`)
    try {
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
                text: {body: replyMessage}
            },
        });
        toLog(`Sent Whatsapp Message.`)

    } catch (error) {
        toLog(`Error in processing and replying: ${error.message}`,2);
        // todo remove
        toLog("Test Log")
    }
}

module.exports = { sendWhatsappMessage };