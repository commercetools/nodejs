import { exec } from 'child_process'
import fs from 'fs'
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
    it('should print usage information given the help flag', done => {
      exec(`${binPath} --help`, (error, stdout, stderr) => {
        expect(String(stdout)).toMatch(/help/)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    it('should print the module version given the version flag', done => {
      exec(`${binPath} --version`, (error, stdout, stderr) => {
        expect(stdout).toBe(`${version}\n`)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    it('should write output to file', done => {
      const csvFilePath = path.join(samplesFolder, 'return-info-sample.csv')
      const jsonFilePath = tmp.fileSync().name
      const expectedResult = [
        {
          orderNumber: '123',
          returnInfo: [
            {
              returnTrackingId: 'aefa34fe',
              _returnId: '1',
              returnDate: '2016-11-01T08:01:19+0000',
              items: [
                {
                  quantity: 4,
                  lineItemId: '12ae',
                  comment: 'yeah',
                  shipmentState: 'Returned',
                },
                {
                  quantity: 4,
                  lineItemId: '12ae',
                  comment: 'yeah',
                  shipmentState: 'Returned',
                },
              ],
            },
            {
              returnTrackingId: 'aefa34fe',
              _returnId: '2',
              returnDate: '2016-11-01T08:01:19+0000',
              items: [
                {
                  quantity: 4,
                  lineItemId: '12ae',
                  comment: 'yeah',
                  shipmentState: 'Unusable',
                },
              ],
            },
          ],
        },
        {
          orderNumber: '124',
          returnInfo: [
            {
              returnTrackingId: 'aefa34fe',
              _returnId: '2',
              returnDate: '2016-11-01T08:01:19+0000',
              items: [
                {
                  quantity: 4,
                  lineItemId: '12ae',
                  comment: 'yeah',
                  shipmentState: 'Unusable',
                },
              ],
            },
          ],
        },
      ]

      exec(
        `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`,
        (cliError, stdout, stderr) => {
          expect(cliError && stderr).toBeFalsy()

          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
            expect(JSON.parse(data)).toEqual(expectedResult)
            done()
          })
        }
      )
    })
  })

  describe('CLI logs specific errors', () => {
    it('on faulty CSV format', done => {
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')
      const jsonFilePath = tmp.fileSync().name

      exec(
        `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr.match(/Row length does not match headers/)).toBeTruthy()
          done()
        }
      )
    })

    it('on missing return-info headers', done => {
      const csvFilePath = path.join(
        samplesFolder,
        'return-info-error2-sample.csv'
      )
      const jsonFilePath = tmp.fileSync().name

      exec(
        `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t returninfo`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr).toMatch(/Required headers missing: 'orderNumber'/)
          done()
        }
      )
    })

    it('on missing line-item-state headers', done => {
      const csvFilePath = path.join(samplesFolder, 'return-info-sample.csv')
      const jsonFilePath = tmp.fileSync().name

      exec(
        `${binPath} -i ${csvFilePath} -o ${jsonFilePath} -t lineitemstate`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr).toMatch(
            /Required headers missing: 'fromState,toState'/
          )
          done()
        }
      )
    })

    it('stack trace on verbose level', done => {
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')

      exec(
        `${binPath} -i ${csvFilePath} --logLevel verbose -t returninfo`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toMatch('')
          expect(stderr).toMatch(/ERR: Row length does not match headers/)
          done()
        }
      )
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

    it('CLI accepts deliveries csv type', done => {
      const csvFilePath = path.join(
        samplesFolder,
        'deliveries/delivery-simple.csv'
      )
      exec(
        `${binPath} -t deliveries --inputFile ${csvFilePath}`,
        (error, stdout, stderr) => {
          const expectedOutput = [
            {
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
            },
          ]

          expect(error && stderr).toBeFalsy()
          expect(JSON.parse(stdout)).toEqual(expectedOutput)
          done()
        }
      )
    })

    it('CLI should log to file when using stdout for data output', done => {
      const tmpFile = tmp.fileSync()
      const csvFilePath = path.join(
        samplesFolder,
        'deliveries/delivery-simple.csv'
      )
      // eslint-disable-next-line max-len
      exec(
        `${binPath} -t deliveries --inputFile ${csvFilePath} --logFile ${
          tmpFile.name
        }`,
        () => {
          fs.readFile(tmpFile.name, { encoding: 'utf8' }, (error, data) => {
            expect(data).toMatch(/info Starting Deliveries CSV conversion/)
            tmpFile.removeCallback()
            done()
          })
        }
      )
    })

    it('CLI should log errors to stderr and log file', done => {
      const tmpFile = tmp.fileSync()
      const expectedError = 'Row length does not match headers'
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')
      // eslint-disable-next-line max-len
      exec(
        `${binPath} -t deliveries --inputFile ${csvFilePath} --logFile ${
          tmpFile.name
        }`,
        (error, stdout, stderr) => {
          expect(error).toBeTruthy()
          expect(stderr).toMatch(expectedError)

          fs.readFile(tmpFile.name, { encoding: 'utf8' }, (err, data) => {
            expect(data).toContain(expectedError)
            tmpFile.removeCallback()
            done()
          })
        }
      )
    })
  })
})
