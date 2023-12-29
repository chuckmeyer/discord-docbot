require("dotenv").config()

exports.config = {
    algolia: {
        appId: process.env.ALGOLIA_APPLICATION_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        index: process.env.ALGOLIA_INDEX,
    },
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        token: process.env.DISCORD_API_TOKEN,
    },
    baseUrl: process.env.BASE_URL
    // Add other configuration settings as needed
};
