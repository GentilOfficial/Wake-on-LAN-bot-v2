# Wake-on-LAN-bot-v2

Second tweak of my telegram bot to remotely turn on my PC

## 🔎 What I Used?

-   [_Telegraf_](https://github.com/telegraf/telegraf) &rarr; To manage the Telegram bot
-   [_WOL_](https://github.com/song940/wake-on-lan) &rarr; To send a Magic Packet to the PC.
-   [_Ping_](https://github.com/danielzzz/node-ping) &rarr; To check the status of the PC.

## 🚀 Getting Started!

### Install dependencies

```bash
  npm i
```

### Environment Variables

To set all the appropriate variables I created an _.env_ file where I set these variables:

-   _BOT_TOKEN_ &rarr; The Telegram BOT token in order to be able to use its functionality.

-   _TELEGRAM_USERNAME_ &rarr; My telegram username.

-   _PC_MAC_ADDRESS_ &rarr; The mac address of my PC so i can turn it on.

-   _PC_IP_ADDRESS_ &rarr; The local ip address of my PC so i can check its status.

-   _USER_CHAT_ID_ &rarr; The ID of my Telegram chat with the BOT to be able to use the commands.

-   _LOG_CHAT_ID_ &rarr; The ID of a Telegram channel with the BOT inside to send the actions performed.

### Start bot

```bash
  node index
```
