const { REST, Routes } = require('discord.js')
const { config } = require('../config.js')
const path = require('path')
const fs = require('fs')

// Retrieve command definitions = require(files
const loadCommands = async () => {
  const commands = []

  const foldersPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(foldersPath); 

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
  return commands
}

// Create a client for accessing the Discord REST API
const DISCORD_REST_CLIENT = new REST({ version: '10' })
	.setToken(config.discord.token)

async function registerCommands(guildID) {
  const commands = await loadCommands()

  console.log(`Started refreshing ${commands.length} application (/) commands.`);

	// Generate the API route for updating bot commands within this server.
	const route = Routes.applicationGuildCommands(config.discord.clientId, guildID)

  try {
    // Send the command object to Discord
    const data = await DISCORD_REST_CLIENT.put(route, { body: commands })
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error)
  }
}

module.exports = { registerCommands }
