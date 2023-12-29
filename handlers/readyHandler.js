const { registerCommands } = require('../register/registerCommands.js')

async function handleReady(client) {
	const guilds = await client.guilds.fetch()

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
