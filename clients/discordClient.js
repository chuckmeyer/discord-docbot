import { config } from '../config.js'
import {
	Client,
	GatewayIntentBits,
} from 'discord.js'

export const discordClient = new Client({intents: [GatewayIntentBits.Guilds] })
