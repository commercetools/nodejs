import { exec } from 'mz/child_process'
import fs from 'mz/fs'
import path from 'path'
import streamtest from 'streamtest'
import tmp from 'tmp'
import {
  AddReturnInfoCsvParser,
  LineItemStateCsvParser,
} from '@commercetools/csv-parser-orders'
import { version } from '@commercetools/csv-parser-orders/package.json'

describe('CSV and CLI Tests', () => {
  const binPath = './integration-tests/node_modules/.bin/csvparserorder'
  const samplesFolder = './packages/csv-parser-orders/test/data'

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --help`)
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()
    })

    it('should print the module version given the version flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --version`)
      expect(stderr).toBeFalsy()
      expect(stdout).toBe(`${version}\n`)
    })

    it('should write output to file', async () => {
      const csvFilePath = path.join(samplesFolder, 'return-info-sample.csv')
      const jsonFilePath = tmp.fileSync().name

      await exec(
        `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`
      )
      const data = await fs.readFile(jsonFilePath, { encoding: 'utf8' })
      expect(JSON.parse(data)).toMatchSnapshot()
    })
  })

  describe('CLI logs specific errors', () => {
    it('on faulty CSV format', async () => {
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')
      const jsonFilePath = tmp.fileSync().name
      try {
        await exec(
          `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(String(error)).toMatch(/Row length does not match headers/)
      }
    })

    it('on missing return-info headers', async () => {
      const csvFilePath = path.join(
        samplesFolder,
        'return-info-error2-sample.csv'
      )
      const jsonFilePath = tmp.fileSync().name

      try {
        await exec(
          `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(String(error)).toMatch(/Required headers missing: 'orderNumber'/)
      }
    })

    it('on missing line-item-state headers', async () => {
      const csvFilePath = path.join(samplesFolder, 'return-info-sample.csv')
      const jsonFilePath = tmp.fileSync().name

      try {
        await exec(
          `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t lineitemstate`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(String(error)).toMatch(
          /Required headers missing: 'fromState,toState'/
        )
      }
    })

    it('stack trace on verbose level', async () => {
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')
      try {
        await exec(
          `${binPath} -i ${csvFilePath} --logLevel verbose -t returninfo`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(String(error)).toMatch(/ERR: Row length does not match headers/)
      }
    })
  })

  describe('parses CSV to JSON', () => {
    it('should parse return-info CSV into JSON', done => {
      const csvFilePath = path.join(samplesFolder, 'return-info-sample.csv')
      const csvParserOrder = new AddReturnInfoCsvParser()
      const inputStream = fs.createReadStream(csvFilePath)

      const outputStream = streamtest.v2.toText((error, output) => {
        const returnInfos = JSON.parse(output)
        const expected = path.join(
          __dirname,
          'expected-output',
          'csv-parser-order-returninfo.json'
        )
        const expectedArray = JSON.parse(fs.readFileSync(expected, 'utf8'))

        expect(returnInfos).toBeInstanceOf(Array)
        expect(returnInfos).toMatchObject(expectedArray)
        done()
      })

      csvParserOrder.parse(inputStream, outputStream)
    })

    it('should parse line-item-state CSV into JSON', done => {
      const csvFilePath = path.join(samplesFolder, 'lineitemstate-sample.csv')
      const csvParserOrder = new LineItemStateCsvParser()
      const inputStream = fs.createReadStream(csvFilePath)

      const outputStream = streamtest.v2.toText((error, output) => {
        const lineItemStates = JSON.parse(output)
        const expected = path.join(
          __dirname,
          'expected-output',
          'csv-parser-order-lineitemstate.json'
        )
        const expectedArray = JSON.parse(fs.readFileSync(expected, 'utf8'))

        expect(lineItemStates).toBeInstanceOf(Array)
        expect(lineItemStates).toMatchObject(expectedArray)
        done()
      })

      csvParserOrder.parse(inputStream, outputStream)
    })

    it('CLI accepts deliveries csv type', async () => {
      const csvFilePath = path.join(
        samplesFolder,
        'deliveries/delivery-simple.csv'
      )
      const stdout = await exec(
        `${binPath} -t deliveries --inputFile ${csvFilePath}`
      )
      expect(stdout).toMatchSnapshot()
    })

    it('CLI should log to file when using stdout for data output', async () => {
      const tmpFile = tmp.fileSync()
      const csvFilePath = path.join(
        samplesFolder,
        'deliveries/delivery-simple.csv'
      )

      await exec(
        `${binPath} -t deliveries --inputFile ${csvFilePath} --logFile ${
          tmpFile.name
        }`
      )
      const data = await fs.readFile(tmpFile.name, { encoding: 'utf8' })
      expect(data).toMatchSnapshot()
    })

    it('CLI should log errors to stderr and log file', async () => {
      const tmpFile = tmp.fileSync()
      const expectedError = 'Row length does not match headers'
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')

      try {
        await exec(
          `${binPath} -t deliveries --inputFile ${csvFilePath} --logFile ${
            tmpFile.name
          }`
        )
      } catch (error) {
        expect(error).toBeTruthy()
        expect(String(error)).toMatch(expectedError)
      }
    })
  })
})
