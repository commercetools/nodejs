import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import streamtest from 'streamtest'
import tmp from 'tmp'
import {
  AddReturnInfoCsvParser,
  LineItemStateCsvParser,
} from '../../packages/csv-parser-order/src/index'
import { version } from '../../packages/csv-parser-order/package.json'

describe('CSV and CLI Tests', () => {
  const binPath = './integration-tests/node_modules/.bin/csvparserorder'
  const samplesFolder = './packages/csv-parser-order/test/data/'

  describe('CLI basic functionality', () => {
    test('should print usage information given the help flag', (done) => {
      exec(`${binPath} --help`, (error, stdout, stderr) => {
        expect(String(stdout)).toMatch(/help/)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    test('should print the module version given the version flag', (done) => {
      exec(`${binPath} --version`, (error, stdout, stderr) => {
        expect(stdout).toBe(`${version}\n`)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    test('should write output to file', (done) => {
      const csvFilePath = `${samplesFolder}return-info-sample.csv`
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`,
        (cliError, stdout, stderr) => {
          expect(cliError && stderr).toBeFalsy()

          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(data.match(/returnInfo/)).toBeTruthy()
            expect(error).toBeFalsy()
            done()
          })
        },
      )
    })
  })

  describe('CLI logs specific errors', () => {
    test('on faulty CSV format', (done) => {
      // eslint-disable-next-line max-len
      const csvFilePath = `${samplesFolder}faulty-sample.csv`
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr.match(/Row length does not match headers/)).toBeTruthy()
          done()
        },
      )
    })

    test('on missing return-info headers', (done) => {
      const csvFilePath = `${samplesFolder}return-info-error2-sample.csv`
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr).toMatch(/Required headers missing: 'orderNumber'/)
          done()
        },
      )
    })

    test('on missing line-item-state headers', (done) => {
      const csvFilePath = `${samplesFolder}return-info-sample.csv`
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t lineitemstate`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          // eslint-disable-next-line max-len
          expect(stderr).toMatch(/Required headers missing: 'fromState,toState'/)
          done()
        },
      )
    })

    test('stack trace on verbose level', (done) => {
      const csvFilePath = `${samplesFolder}faulty-sample.csv`

      exec(`${binPath} -i ${csvFilePath} --logLevel verbose -t returninfo`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr).toMatch(/\.js:\d+:\d+/)
          done()
        },
      )
    })

    test('should return an error when invalid item row is present', (done) => {
      // eslint-disable-next-line max-len
      const csvFile = `${samplesFolder}deliveries/delivery-error-invalid-item.csv`
      const expectedError = /which has different values across multiple rows/

      exec(`${binPath} -i ${csvFile} -t deliveries`,
        (error, stdout, stderr) => {
          expect(error).toBeTruthy()
          expect(stdout).toBeFalsy()
          expect(expectedError.test(stderr)).toBeTruthy()
          done()
        }
      )
    })

    test('should return error when invalid parcel row is present', (done) => {
      const csvFile = `${samplesFolder}deliveries/parcel-error-invalid-item.csv`
      const expectedError = /which has different values across multiple rows/

      exec(`${binPath} -i ${csvFile} -t deliveries`,
        (error, stdout, stderr) => {
          expect(error).toBeTruthy()
          expect(stdout).toBeFalsy()
          expect(expectedError.test(stderr)).toBeTruthy()
          done()
        }
      )
    })
  })

  describe('parses CSV to JSON', () => {
    test('should parse return-info CSV into JSON', (done) => {
      const csvFilePath = `${samplesFolder}return-info-sample.csv`
      const csvParserOrder = new AddReturnInfoCsvParser()
      const inputStream = fs.createReadStream(csvFilePath)

      const outputStream = streamtest['v2'].toText((error, output) => {
        const returnInfos = JSON.parse(output)
        const expected = path.join(
          __dirname,
          'expected-output',
          'csv-parser-order-returninfo.json',
        )
        const expectedArray = JSON.parse(fs.readFileSync(expected, 'utf8'))

        expect(returnInfos).toBeInstanceOf(Array)
        expect(returnInfos).toMatchObject(expectedArray)
        done()
      })

      csvParserOrder.parse(inputStream, outputStream)
    })

    test('should parse line-item-state CSV into JSON', (done) => {
      const csvFilePath = `${samplesFolder}lineitemstate-sample.csv`
      const csvParserOrder = new LineItemStateCsvParser()
      const inputStream = fs.createReadStream(csvFilePath)

      const outputStream = streamtest['v2'].toText((error, output) => {
        const lineItemStates = JSON.parse(output)
        const expected = path.join(
          __dirname,
          'expected-output',
          'csv-parser-order-lineitemstate.json',
        )
        const expectedArray = JSON.parse(fs.readFileSync(expected, 'utf8'))

        expect(lineItemStates).toBeInstanceOf(Array)
        expect(lineItemStates).toMatchObject(expectedArray)
        done()
      })

      csvParserOrder.parse(inputStream, outputStream)
    })

    test('CLI accepts deliveries csv type', (done) => {
      const csvFilePath = `${samplesFolder}deliveries/delivery-simple.csv`
      exec(`${binPath} -t deliveries --inputFile ${csvFilePath}`,
        (error, stdout, stderr) => {
          const expectedOutput = [{
            orderNumber: '222',
            shippingInfo: {
              deliveries: [
                {
                  id: '1',
                  items: [
                    {
                      id: '1',
                      quantity: 100,
                    },
                  ],
                },
              ],
            },
          }]

          expect(error && stderr).toBeFalsy()
          expect(JSON.parse(stdout)).toEqual(expectedOutput)
          done()
        }
      )
    })
  })
})
