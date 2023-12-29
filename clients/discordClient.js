const { Client, GatewayIntentBits } = require('discord.js');

exports.discordClient = new Client({intents: [GatewayIntentBits.Guilds] })
