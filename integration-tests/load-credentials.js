export default function loadCredentials (projectKey) {
  // 1. Try to read credentials from ENV variables first.
  // The format is:
  //   CREDENTIALS_<PROJECT_KEY>=<CLIENT_ID:CLIENT_SECRET>
  // E.g.: projectKey = `foo-123`
  //   CREDENTIALS_FOO_123=<CLIENT_ID:CLIENT_SECRET>
  const envVarKey = `CT_${projectKey.toUpperCase().replace(/-/g, '_')}`
  const envVar = process.env[envVarKey]
  if (envVar) {
    const [ clientId, clientSecret ] = envVar.split(':')
    return {
      projectKey,
      clientId,
      clientSecret,
    }
  }

  // 2. Try to read credentials from encrypted `credentials.js` file.
  // NOTE: this is used internally from commercetools contributors
  // for development.
  try {
    // eslint-disable-next-line global-require
    const credentials = require('./credentials')
    if (credentials[projectKey]) {
      const { clientId, clientSecret } = credentials[projectKey]
      return {
        projectKey,
        clientId,
        clientSecret,
      }
    }
  } catch (error) {
    /* noop */
  }

  throw new Error(
    `Cannot find any credentials for projectKey ${projectKey}. ` +
    'Please ensure that the projectKey is correct, the environment variable ' +
    'is properly set or the credentials.js file is decrypted.',
  )
}
