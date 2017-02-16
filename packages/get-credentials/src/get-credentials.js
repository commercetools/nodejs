import dotenv from 'dotenv'
import path from 'path'

import { homepage } from '../package.json'

export default function getCredentials (projectKey) {
  if (!projectKey)
    return Promise.reject([new Error('Project Key is needed')])

  return Promise.resolve(setCredentialsFromEnvFile())
    .catch(Promise.resolve)
    .then(dotenvError => getCredentialsFromEnvironment(projectKey)
      .catch(environmentError =>
        Promise.reject([dotenvError, environmentError]),
      ))
}

export function getCredentialsFromEnvironment (projectKey) {
  return new Promise((resolve, reject) => {
    const envKey = `CT_${projectKey.toUpperCase().replace(/-/g, '_')}`
    const envValue = process.env[envKey] || ''

    if (!envValue)
      return reject(new Error(
        `Could not find environment variable ${envKey}`,
      ))

    if (!envValue.match(/\w+:\w+/))
      return reject(new Error(
        `Could not get credentials from value '${envValue}' in ${envKey}
        see ${homepage}#usage`,
      ))

    const [clientId, clientSecret] = envValue.split(':')

    return resolve({
      clientId,
      clientSecret,
    })
  })
}

export function setCredentialsFromEnvFile () {
  const currentDirectoryResult = dotenv.config({
    path: path.resolve('ct-credentials.env'),
  })
  const etcDirectoryResult = dotenv.config({
    path: path.resolve(path.join('/etc', 'ct-credentials.env')),
  })

  if (currentDirectoryResult.error && etcDirectoryResult.error)
    return new Error(
      'Could not get credentials from .env file',
    )

  return {
    ...currentDirectoryResult.parsed,
    ...etcDirectoryResult.parsed,
  }
}
