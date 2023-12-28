// const { globalHandler } = require('../handler.js')

exports.data = {
  name: 'search',
  type: 1,
  description: 'Search the Algolia docs.',
  options: [
    {
      name: 'query',
      type: 3,
      description: 'The keywords to search',
      required: true
    }
  ]
}

const action = async (body) => {
  // May do something here with body
  // Body contains Discord command details
  let response = {
    "content": "Hello from Chuck!"
  }
  return response
}

// exports.handler = (event) => {
//  globalHandler(event, action)
// }

