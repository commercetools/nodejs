import path from 'path'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/csv-parser-state/package.json'

let projectKey
if (process.env.CI === 'true') projectKey = 'state-import-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('CSV and CLI Tests', () => {
  const binPath = './integration-tests/node_modules/.bin/csv-parser-state'

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
  })

  describe('Parse', () => {
    describe('without transitions', () => {
      const statesCsv = path.join(
        __dirname,
        './helpers/statesWithoutTransitions.csv'
      )
      // No projectkey ensures the API is not called
      it('should parse states without projectKey', async () => {
        const [stdout, stderr] = await exec(`${binPath} --input ${statesCsv}`)
        expect(stderr).toBeFalsy()
        expect(JSON.parse(stdout)).toHaveLength(2)
        expect(stdout).toMatchSnapshot()
      })
    })

    describe('with transitions', () => {
      const statesCsv = path.join(
        __dirname,
        '../../packages/csv-parser-state/test/helpers/sampleStates.csv'
      )
      describe('without `projectkey`', () => {
        describe('without `continueOnProblems`', () => {
          it('should stop parsing and return error', async () => {
            await expect(
              exec(`${binPath} --input ${statesCsv}`)
            ).rejects.toThrow(/No project defined/)
          })
        })

        describe('with `continueOnProblems`', () => {
          it('should skip rows having transition', async () => {
            const [stdout, stderr] = await exec(
              `${binPath} --input ${statesCsv} --continueOnProblems`
            )
            expect(stderr).toBeFalsy()
            expect(JSON.parse(stdout)).toHaveLength(3)
            expect(stdout).toMatchSnapshot()
          })
        })
      })

      describe('with `projectKey`', () => {
        it('should resolve transition and parse states', async () => {
          const [stdout, stderr] = await exec(
            `${binPath} -p ${projectKey} --input ${statesCsv}`
          )
          expect(stderr).toBeFalsy()
          expect(JSON.parse(stdout)).toHaveLength(4)
          expect(stdout).toMatchSnapshot()
        })
      })
    })
  })
})
