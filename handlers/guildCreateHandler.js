import { registerCommands } from '../commands/registerCommands.js'

export async function handleGuildCreate(guild) {
	await registerCommands(guild.id)
}
