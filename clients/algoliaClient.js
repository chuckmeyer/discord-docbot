import { config } from '../config.js'
import algoliasearch from 'algoliasearch'

const ALGOLIA_CLIENT = algoliasearch(config.algolia.appId, config.algolia.apiKey)

export const algoliaClient = ALGOLIA_CLIENT.initIndex(config.algolia.index)
