// Load .env file
require('dotenv-extended').load({ errorOnMissing: true })

export const config = {
  githubKey: process.env.GITHUB_KEY
}
