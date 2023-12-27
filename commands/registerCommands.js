import {
  SlashCommandBuilder
} from 'discord.js'
import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { config } from '../config.js'

// Create a client for accessing the Discord REST API
const DISCORD_REST_CLIENT = new REST({ version: '10' })
	.setToken(config.discord.token)

export async function registerCommands(guildID) {
	// Generate the API route for updating bot commands within this server.
	const route = Routes.applicationGuildCommands(config.discord.clientId, guildID)

	// Create an object representing our /search command for the Discord API.
	const commandData = new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search the docs!')
		.addStringOption(option => {
			return option
				.setName('query')
				.setDescription('The query to be searched')
				.setRequired(true)
		})
		.toJSON()

	// Send the command object to Discord
	await DISCORD_REST_CLIENT.put(route, { body: [commandData] })

	console.log('Successfully created the /search command!')
}
