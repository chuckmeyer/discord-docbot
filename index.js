const { config } = require('./config.js')
const { discordClient } = require('./clients/discordClient.js')
const { handleReady } = require('./handlers/readyHandler.js')
const { handleGuildCreate } = require('./handlers/guildCreateHandler.js')
const { handleInteractionCreate } = require('./handlers/interactionCreateHandler.js')
const { loadCommands } = require('./register/loadCommands.js')
const { Collection } = require('discord.js')

discordClient.commands = new Collection()
const commands = loadCommands()

commands.map((command) => {
  discordClient.commands.set(command.data.name, command)
})

// The ready event is triggered once the client has successfully logged in.
discordClient.once('ready', handleReady)
discordClient.on('guildCreate', handleGuildCreate)
discordClient.on('interactionCreate', handleInteractionCreate)

// Connect the bot to Discord!
discordClient.login(config.discord.token)
