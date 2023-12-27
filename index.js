import { config } from './config.js'
import { discordClient } from './clients/discordClient.js'
import { handleReady } from './handlers/readyHandler.js'
import { handleGuildCreate } from './handlers/guildCreateHandler.js'
import { handleInteractionCreate } from './handlers/interactionCreateHandler.js'

// The ready event is triggered once the client has successfully logged in.
discordClient.once('ready', handleReady)
discordClient.on('guildCreate', handleGuildCreate)
discordClient.on('interactionCreate', handleInteractionCreate)

// Connect the bot to Discord!
discordClient.login(config.discord.token)
