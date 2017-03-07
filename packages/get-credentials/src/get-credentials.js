import dotenv from 'dotenv'
import path from 'path'

import { homepage } from '../package.json'

export default function getCredentials (projectKey) {
  if (!projectKey)
    return Promise.reject(new Error('Missing "projectKey" argument'))

  return Promise.resolve(setCredentialsFromEnvFile())
    .then(() => getCredentialsFromEnvironment(projectKey))
    .catch(environmentError =>
      Promise.reject(environmentError),
    )
}

export function getCredentialsFromEnvironment (projectKey) {
  return new Promise((resolve, reject) => {
    const envKey = `CT_${projectKey.toUpperCase().replace(/-/g, '_')}`
    const envValue = process.env[envKey] || ''

    if (!envValue)
      return reject(new Error(
        `Could not find environment variable ${envKey}
        see ${homepage}#usage`,
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
    path: path.resolve('.ct-credentials.env'),
  })
  const etcDirectoryResult = dotenv.config({
    path: path.resolve(path.join('/etc', '.ct-credentials.env')),
  })

  return {
    ...currentDirectoryResult.parsed,
    ...etcDirectoryResult.parsed,
  }
}
