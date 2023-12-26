import 'dotenv/config'
import {
	Client,
  EmbedBuilder,
	GatewayIntentBits,
  InteractionType,
  SlashCommandBuilder
} from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import algoliasearch from 'algoliasearch';

const { 
 	ALGOLIA_API_KEY,
	ALGOLIA_APPLICATION_ID,
  ALGOLIA_INDEX,
  DISCORD_CLIENT_ID,
  DISCORD_API_TOKEN,
  BASE_URL
} = process.env

const DISCORD_CLIENT = new Client({intents: [GatewayIntentBits.Guilds] })
const ALGOLIA_CLIENT = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY)

const INDEX = ALGOLIA_CLIENT.initIndex(ALGOLIA_INDEX)

// Create a client for accessing the Discord REST API
const DISCORD_REST_CLIENT = new REST({ version: '10' })
	.setToken(DISCORD_API_TOKEN)

async function handleGuildCreate(guild) {
	await registerCommands(guild.id)
}

async function handleReady() {
	// Get the collection of servers the bot is already in
	const guilds = await DISCORD_CLIENT.guilds.fetch()

	// Convert the guilds collection to an array of guild IDs
	const guildIDs = Array.from(guilds.keys())

	// Loop over guild IDs and register commands for each server
	let guildIndex = 0
	while (guildIndex < guildIDs.length) {
		const guildID = guildIDs[guildIndex]

		await registerCommands(guildID)
		guildIndex += 1
	}
	console.log('Ready!')
}

async function registerCommands(guildID) {
	// Generate the API route for updating bot commands within this server.
	const route = Routes.applicationGuildCommands(DISCORD_CLIENT_ID, guildID)

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

async function handleInteractionCreate(interaction) {
	// Exit if it's a non-command interaction.
	if ((interaction.type !== InteractionType.ApplicationCommand)) {
		return
	}

	// Exit if it's a command other than /search.
	if (interaction.commandName !== 'search') {
		return
	}

	try {
    await interaction.deferReply()
		const query = interaction.options.get('query').value
		const response = await INDEX.search(query, { hitsPerPage: 3 })

		// Exit early if there aren't any matches
 		if (response.hits.length === 0) {
			await interaction.editReply('No results found')
			return
		}

		// Compile the matches into a Markdown formatted string
		let headingString = `I found ${response.nbHits} matches for *${query}*.`
    if (response.nbHits.length <= 3) {
      headingString += " Here's what I found:"
    } else {
      headingString += " Here's the top 3:"
    }

    // Process the result set
    const resultsString = response.hits
      .reduce((accumulator, hit, index) => {
        const url = BASE_URL + hit.url
        const resultNumber = `\`${index + 1})\``
        accumulator.push(`- [${hit.title}](${url})`)
        return accumulator
      }, [])
      .join('\n')

    console.log(resultsString)

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Search Results')
          .setDescription(`${headingString}\n\n${resultsString}`),
      ],
    })
	} catch (error) {
		// Log any errors we run into
		console.error(error)
    await interaction.editReply("Sorry, there was a problem.")
	}
}

// The ready event is triggered once the client has successfully logged in.
DISCORD_CLIENT.once('ready', handleReady)
DISCORD_CLIENT.on('guildCreate', handleGuildCreate)
DISCORD_CLIENT.on('interactionCreate', handleInteractionCreate)

// Connect the bot to Discord!
DISCORD_CLIENT.login(DISCORD_API_TOKEN)

