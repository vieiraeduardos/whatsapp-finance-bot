//const { Client } = require("whatsapp-web.js");
//const { generate } = require("qrcode-terminal");

import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("QR code generated successfully. Scan with your phone.");
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", msg => {
    console.log("Message received: ", msg.body);
    if (msg.body == "!ping") {
        msg.reply("pong");
    }
});

client.initialize();