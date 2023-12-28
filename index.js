const { config } = require('./config.js')
const { discordClient } = require('./clients/discordClient.js')
const { handleReady } = require('./handlers/readyHandler.js')
const { handleGuildCreate } = require('./handlers/guildCreateHandler.js')
const { handleInteractionCreate } = require('./handlers/interactionCreateHandler.js')

const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

discordClient.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			discordClient.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// The ready event is triggered once the client has successfully logged in.
discordClient.once('ready', handleReady)
discordClient.on('guildCreate', handleGuildCreate)
discordClient.on('interactionCreate', handleInteractionCreate)

// Connect the bot to Discord!
discordClient.login(config.discord.token)
