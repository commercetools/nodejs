import fetch from 'node-fetch'

const config = {
  host: 'https://auth.commercetools.com',
  projectKey: 'sample-project',
  credentials: {
    clientId: 'sampleClient',
    clientSecret: 'sampleSecret',
  },
  fetch,
}

export default config
