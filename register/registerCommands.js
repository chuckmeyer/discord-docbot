const { REST, Routes } = require('discord.js')
const { config } = require('../config.js')
const { loadCommands } = require('./loadCommands.js')

// Create a client for accessing the Discord REST API
const DISCORD_REST_CLIENT = new REST({ version: '10' })
	.setToken(config.discord.token)

async function registerCommands(guildID) {
  const commands = loadCommands()

  console.log(`Started refreshing ${commands.length} application (/) commands.`)
  const jsonCommands = commands.map((command) => command.data.toJSON())

	// Generate the API route for updating bot commands within this server.
	const route = Routes.applicationGuildCommands(config.discord.clientId, guildID)

  try {
    // Send the command object to Discord
    const data = await DISCORD_REST_CLIENT.put(route, { body: jsonCommands })
		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
}

module.exports = { registerCommands }
