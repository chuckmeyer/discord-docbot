const { config } = require('../config.js')
const algoliasearch = require('algoliasearch')

const ALGOLIA_CLIENT = algoliasearch(config.algolia.appId, config.algolia.apiKey)

exports.algoliaClient = ALGOLIA_CLIENT.initIndex(config.algolia.index)
