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
            msg.reply("Uso: /gasto <valor> <categoria> <descrição>");
            return;
        }

        const client = new SQLiteClient();

        client.insert_despense(
            {
                user_id: msg.from,
                description: args.slice(3).join(" "),
                category: args[2],
                value: parseFloat(args[1]),
                created_at: new Date().toISOString()
            }
        ).then(() => {
            console.log("Despense inserted successfully.");
            msg.reply("Gasto registrado com sucesso!");
            return;
        }).catch(err => {
            console.error("Error inserting despense: ", err);
            msg.reply("Erro ao registrar gasto. Tente novamente mais tarde!");
            return;
        });
    }

    if (msg.body.startsWith("/receita")) {
        const args = msg.body.split(" ");

        if (args.length < 3) {
            msg.reply("Uso: /receita <valor> <descrição>");
            return;
        }

        const client = new SQLiteClient();

        client.insert_revenue(
            {
                user_id: msg.from,
                description: args.slice(2).join(" "),
                value: parseFloat(args[1]),
                created_at: new Date().toISOString()
            }
        ).then(() => {
            console.log("Revenue inserted successfully.");
            msg.reply("Receita registrada com sucesso!");
            return;
        }).catch(err => {
            console.error("Error inserting revenue: ", err);
            msg.reply("Erro ao registrar receita. Tente novamente mais tarde!");
            return;
        });
    }

    if (msg.body.startsWith("/relatorio")) {
        const args = msg.body.split(" ");

        if (args.length < 2) {
            msg.reply("Uso: /relatorio");
            return;
        }

        const client = new SQLiteClient();

        client.get_report(
            {
                user_id: msg.from,
            }
        ).then((report) => {
            console.log("Report retrieved successfully.");
            msg.reply(`Relatório: ${JSON.stringify(report)}`);
            return;
        }).catch(err => {
            console.error("Error retrieving report: ", err);
            msg.reply("Erro ao gerar relatório. Tente novamente mais tarde!");
            return;
        });
    }
});

client.initialize();