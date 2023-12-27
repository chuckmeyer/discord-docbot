import {
  EmbedBuilder,
  InteractionType
} from 'discord.js'
import { algoliaClient } from '../clients/algoliaClient.js'
import { config } from '../config.js'

export async function handleInteractionCreate(interaction) {
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
		const response = await algoliaClient.search(query, { hitsPerPage: 3 })

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
        const url = config.baseUrl + hit.url
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
