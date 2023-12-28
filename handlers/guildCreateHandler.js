const { registerCommands } = require('../register/registerCommands.js')

async function handleGuildCreate(guild) {
	await registerCommands(guild.id)
}

module.exports = { handleGuildCreate }
