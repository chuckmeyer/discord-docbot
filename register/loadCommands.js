const fs = require('fs')
const path = require('path')

// Retrieve command definitions = require(files
const loadCommands = () => {
  const commands = []

  const foldersPath = path.join(__dirname, '../commands')
  const commandFolders = fs.readdirSync(foldersPath) 

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const command = require(filePath)
      if ('data' in command && 'execute' in command) {
        // console.log(`Adding ${command.data.name} at ${filePath.toString()} to commands...`)
        commands.push(command)
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
      }
    }
  }
  return commands
}

module.exports = { loadCommands }