import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client();

import SQLiteClient from "./models/sqlite-client.js";

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("QR code generated successfully. Scan with your phone.");
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", msg => {
    console.log("Message received: ", msg.body);
    if (msg.body.startsWith("/gasto")) {
        const args = msg.body.split(" ");

        if (args.length < 4) {
            msg.reply("Uso: /gasto <preço> <categoria> <descrição>");
            return;
        }

        const client = new SQLiteClient();

        client.insert_despense(
            {
                user_id: msg.from,
                description: args.slice(3).join(" "),
                category: args[2],
                price: parseFloat(args[1]),
                created_at: new Date().toISOString()
            }
        ).then(() => {
            console.log("Despense inserted successfully.");
            msg.reply("Gasto registrado com sucesso!");
        }).catch(err => {
            console.error("Error inserting despense: ", err);
            msg.reply("Erro ao registrar gasto. Tente novamente mais tarde!");
        });
    }
});

client.initialize();