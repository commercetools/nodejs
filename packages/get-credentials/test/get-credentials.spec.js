import fs from 'fs'
// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon'

import {
  getCredentials,
  getCredentialsFromEnvironment,
  setCredentialsFromEnvFile,
} from '../src/index'
import { homepage } from '../package.json'

const expectedErrorText = {
  invalidEnvFormat: /could not get credentials/i,
  undefinedEnv: /could not find environment variable/i,
}

describe('getCredentials', () => {
  afterEach(() => sinon.restore())

  test('should reject error when missing project key argument', () => {
    return new Promise((done) => {
      getCredentials()
        .then(done.fail)
        .catch((error) => {
          expect(error.message).toBe('Missing "projectKey" argument')
          done()
        })
    })
  })

  test('should reject when project credentials are not found', () => {
    return new Promise((done) => {
      getCredentials('forgery')
        .then(done.fail)
        .catch((error) => {
          expect(error.message).toMatch(expectedErrorText.undefinedEnv)
          done()
        })
    })
  })
})

describe('getCredentialsFromEnvironment', () => {
  beforeAll(() => {
    process.env.CT_STROOPWAFEL = ''
  })

  afterEach(() => sinon.restore())

  afterAll(() => delete process.env.CT_STROOPWAFEL)

  test('should resolve credentials from environment variables', () => {
    sinon.stub(process.env, 'CT_STROOPWAFEL').value('nyw:les')

    return getCredentialsFromEnvironment('stroopwafel').then((credentials) =>
      expect(credentials).toEqual({
        clientId: 'nyw',
        clientSecret: 'les',
      })
    )
  })

  test('should reject on incorrect environment variable value', async () => {
    sinon.stub(process.env, 'CT_STROOPWAFEL').value('nyw:les')
    sinon.stub(process, 'env').callsFake({ CT_STROOPWAFEL: 'nywles' })

    await getCredentialsFromEnvironment('stroopwafel')
      .then()
      .catch((error) => {
        expect(error.message).toMatch(expectedErrorText.invalidEnvFormat)
        expect(error.message).toMatch(new RegExp(homepage))
      })
  })

  test('should reject on absent environment variable key', () => {
    return new Promise((done) => {
      getCredentialsFromEnvironment('pepernoten')
        .then(done.fail)
        .catch((error) => {
          expect(error.message).toMatch(expectedErrorText.undefinedEnv)
          expect(error.message).toMatch(new RegExp(homepage))
          done()
        })
    })
  })
})

describe('setCredentialsFromEnvFile', () => {
  afterEach(() => {
    sinon.restore()
    delete process.env.CT_STROOPWAFEL
  })

  test('should set environment variables', () => {
    sinon.stub(fs, 'readFileSync').returns(`
    CT_STROOPWAFEL=dev:null
    CT_PANNENKOEK=dev:urandom
    `)

    const result = setCredentialsFromEnvFile()

    expect(process.env.CT_STROOPWAFEL).toBe(result.CT_STROOPWAFEL)
    expect(process.env.CT_PANNENKOEK).toBe(result.CT_PANNENKOEK)
  })

  test('should not override existing environment variables', () => {
    process.env.CT_STROOPWAFEL = ''

    sinon.stub(process.env, 'CT_STROOPWAFEL').value('nyw:les')
    sinon.stub(fs, 'readFileSync').returns('CT_STROOPWAFEL=dev:null')

    setCredentialsFromEnvFile()

    expect(process.env.CT_STROOPWAFEL).toBe('nyw:les')
  })
})
