require("events").EventEmitter.defaultMaxListeners = Infinity;

require("dotenv").config();

const https = require("https");

const { Telegraf } = require("telegraf");

const ping = require("ping");

const wol = require("wol");

const bot = new Telegraf(process.env.BOT_TOKEN);

https.get(
    { host: "worldtimeapi.org", port: 443, path: "/api/ip.json" },
    (resp) => {
        resp.on("data", (result) => {
            var nowDate = JSON.parse(result);
            bot.telegram.sendMessage(
                process.env.LOG_CHAT_ID,
                `*${String(nowDate.datetime)}*\n- Reboot`,
                {
                    parse_mode: "markdown",
                }
            );
        });
    }
);

bot.start((context) => {
    context.chat.id == process.env.USER_CHAT_ID &&
        context.reply(
            `Hey *${context.chat.first_name}*! I can *turn on your PC* and *check if it's up or down*. Below are all the commands.\n\n/isup - check if your PC is up or down\n/turnon - turns on your PC\n\nDesigned and Build by @${process.env.TELEGRAM_USERNAME}`,
            { parse_mode: "markdown" }
        );
});

bot.command("isup", (context) => {
    ping.sys.probe(
        process.env.PC_IP_ADDRESS,
        (isAlive) => {
            context.reply(
                isAlive ? "✅ Your PC looks *UP*" : "❌ Your PC looks *DOWN*",
                {
                    parse_mode: "markdown",
                }
            );
            https.get(
                { host: "worldtimeapi.org", port: 443, path: "/api/ip.json" },
                (resp) => {
                    resp.on("data", (result) => {
                        var nowDate = JSON.parse(result);
                        bot.telegram.sendMessage(
                            process.env.LOG_CHAT_ID,
                            `*${String(nowDate.datetime)}*\n- PC status check`,
                            {
                                parse_mode: "markdown",
                            }
                        );
                    });
                }
            );
        },
        { timeout: 0.05 }
    );
});

bot.command("turnon", (context) => {
    context.reply("*Are you sure* you want to *turn on your PC*?", {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Cancel", callback_data: "cancel" },
                    { text: "Turn on", callback_data: "turnon" },
                ],
            ],
        },
    });
});

bot.action("cancel", (context) => {
    context.answerCbQuery();
    context.editMessageText("🚫 Operation *cancelled*", {
        parse_mode: "markdown",
    });
});

bot.action("turnon", (context) => {
    context.answerCbQuery();
    wol.wake(process.env.PC_MAC_ADDRESS, (err, res) => {
        if (res) {
            context.editMessageText("📨 Request *sent*", {
                parse_mode: "markdown",
            });
            https.get(
                {
                    host: "worldtimeapi.org",
                    port: 443,
                    path: "/api/ip.json",
                },
                (resp) => {
                    resp.on("data", (result) => {
                        var nowDate = JSON.parse(result);
                        bot.telegram.sendMessage(
                            process.env.LOG_CHAT_ID,
                            `*${String(
                                nowDate.datetime
                            )}*\n- Sending request to turn on PC`,
                            {
                                parse_mode: "markdown",
                            }
                        );
                    });
                }
            );
        } else {
            context.editMessageText("⚠️ *Error* in sending request", {
                parse_mode: "markdown",
            });
            https.get(
                {
                    host: "worldtimeapi.org",
                    port: 443,
                    path: "/api/ip.json",
                },
                (resp) => {
                    resp.on("data", (result) => {
                        var nowDate = JSON.parse(result);
                        bot.telegram.sendMessage(
                            process.env.LOG_CHAT_ID,
                            `*${String(
                                nowDate.datetime
                            )}*\n- Error in sending the request to turn on the pc\n\n${JSON.stringify(
                                err
                            )}`,
                            {
                                parse_mode: "markdown",
                            }
                        );
                    });
                }
            );
        }
    });
});

bot.launch();
