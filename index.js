require("dotenv").config();

const https = require("https");

const { Telegraf } = require("telegraf");

const { message } = require("telegraf/filters");

const ping = require("ping");

const wol = require("wol");

const bot = new Telegraf(process.env.BOT_TOKEN);

https.get(
    { host: "worldtimeapi.org", port: 443, path: "/api/ip.json" },
    function (resp) {
        resp.on("data", function (result) {
            var nowDate = JSON.parse(result);
            bot.telegram.sendMessage(
                process.env.LOG_CHAT_ID,
                "<b>" + String(nowDate.datetime) + "</b>\n- Reboot",
                {
                    parse_mode: "HTML",
                }
            );
        });
    }
);

bot.launch();
