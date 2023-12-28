const {  SlashCommandBuilder } = require('discord.js')
const { Routes } = require('discord-api-types/v9')
const { REST } = require('@discordjs/rest')
const { config } = require('../config.js')
const path = require('path')
const fs = require('fs')

// Retrieve command definitions = require(files
const loadCommands = async () => {
  let commandsOut = []

  const commandsPath = 'commands'
  const commands = fs.readdirSync(commandsPath)
  for await (const command of commands) {
    const { data } = require(`../${commandsPath}/${command}`)
    commandsOut.push(data)
    console.log(data.name)
    data.options.map((option) => {console.log(option.name)})
  }

  return commandsOut
}


function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}


// Create a client for accessing the Discord REST API
const DISCORD_REST_CLIENT = new REST({ version: '10' })
	.setToken(config.discord.token)

async function registerCommands(guildID) {
  const commands = await loadCommands()
	// Generate the API route for updating bot commands within this server.
	const route = Routes.applicationGuildCommands(config.discord.clientId, guildID)

	// Create an object representing our /search command for the Discord API.
	const commandData = new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search the Algolia docs!')
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

module.exports = { registerCommands }
