const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { algoliaClient } = require('../../clients/algoliaClient.js')
const { config } = require('../../config.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search the Algolia docs.')
		.addStringOption(option => {
			return option
				.setName('query')
				.setDescription('The query to be searched')
				.setRequired(true)
		}),
	async execute(interaction) {
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
  },
}  
