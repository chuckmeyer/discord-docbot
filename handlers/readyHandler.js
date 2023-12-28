const { discordClient } = require('../clients/discordClient.js')
const { registerCommands } = require('../register/registerCommands.js')

async function handleReady() {
	// Get the collection of servers the bot is already in
	const guilds = await discordClient.guilds.fetch()

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

module.exports = { handleReady }
