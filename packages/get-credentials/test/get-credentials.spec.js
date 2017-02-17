import fs from 'fs'
import sinon from 'sinon'

import {
  getCredentials,
  getCredentialsFromEnvironment,
  setCredentialsFromEnvFile,
} from '../src/index'
import { homepage } from '../package.json'

const expectedErrorText = {
  dotenv: new RegExp(/could not .+ from .env file/, 'i'),
  invalidEnvFormat: new RegExp(/could not get credentials/, 'i'),
  undefinedEnv: new RegExp(/could not find environment variable/, 'i'),
}

describe('getCredentials', () => {
  test('should reject error when missing project key argument', (done) => {
    getCredentials()
      .then(done.fail)
      .catch((errors) => {
        expect(errors[0].message).toBe('Missing "projectKey" argument')
        done()
      })
  })

  test('should reject an array of all errors', (done) => {
    getCredentials('forgery')
      .then(done.fail)
      .catch((errors) => {
        expect(errors.length).toBe(2)
        expect(errors[0].message).toMatch(expectedErrorText.dotenv)
        expect(errors[1].message).toMatch(expectedErrorText.undefinedEnv)
        done()
      })
  })
})

describe('getCredentialsFromEnvironment', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => sandbox.restore())

  test('should resolve credentials from environment variables', () => {
    sandbox.stub(process, 'env', { CT_STROOPWAFEL: 'nyw:les' })

    return getCredentialsFromEnvironment('stroopwafel')
      .then(credentials =>
        expect(credentials).toEqual({
          clientId: 'nyw',
          clientSecret: 'les',
        }),
      )
  })

  test('should reject on incorrect environment variable value', (done) => {
    sandbox.stub(process, 'env', { CT_STROOPWAFEL: 'nywles' })

    getCredentialsFromEnvironment('stroopwafel')
      .then(done.fail)
      .catch((error) => {
        expect(error.message).toMatch(expectedErrorText.invalidEnvFormat)
        expect(error.message).toMatch(new RegExp(homepage))
        done()
      })
  })

  test('should reject on absent environment variable key', (done) => {
    getCredentialsFromEnvironment('pepernoten')
      .then(done.fail)
      .catch((error) => {
        expect(error.message).toMatch(expectedErrorText.undefinedEnv)
        done()
      })
  })
})

describe('setCredentialsFromEnvFile', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => sandbox.restore())

  test('should set environment variables', () => {
    sandbox.stub(fs, 'readFileSync')
      .returns(`
        CT_STROOPWAFEL=dev:null
        CT_PANNENKOEK=dev:urandom
      `)

    const result = setCredentialsFromEnvFile()

    expect(process.env.CT_STROOPWAFEL).toBe(result.CT_STROOPWAFEL)
    expect(process.env.CT_PANNENKOEK).toBe(result.CT_PANNENKOEK)
  })

  test('should not override existing environment variables', () => {
    sandbox.stub(process, 'env', { CT_STROOPWAFEL: 'nyw:les' })
    sandbox.stub(fs, 'readFileSync').returns('CT_STROOPWAFEL=dev:null')

    setCredentialsFromEnvFile()

    expect(process.env.CT_STROOPWAFEL).toBe('nyw:les')
  })

  test('should return error when no dotenv file exists', () => {
    const result = setCredentialsFromEnvFile()

    expect(result.message).toMatch(expectedErrorText.dotenv)
  })
})
