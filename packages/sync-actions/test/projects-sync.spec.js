import createProjectsSync, { actionGroups } from '../src/projects'
import {
  baseActionsList,
  myBusinessUnitActionsList,
  customerSearchActionsList,
} from '../src/projects-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'myBusinessUnit', 'customerSearch'])
  })

  describe('action list', () => {
    test('should contain `changeName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeName', key: 'name' }])
      )
    })

    test('should contain `changeCurrencies` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeCurrencies', key: 'currencies' },
        ])
      )
    })

    test('should contain `changeCountries` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeCountries',
            key: 'countries',
          },
        ])
      )
    })

    test('should contain `changeLanguages` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeLanguages',
            key: 'languages',
          },
        ])
      )
    })

    test('should contain `changeMessagesConfiguration` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeMessagesConfiguration',
            key: 'messagesConfiguration',
          },
        ])
      )
    })

    test('should contain `setShippingRateInputType` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setShippingRateInputType',
            key: 'shippingRateInputType',
          },
        ])
      )
    })

    test('should contain `changeMyBusinessUnitStatusOnCreation` action', () => {
      expect(myBusinessUnitActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeMyBusinessUnitStatusOnCreation',
            key: 'status',
          },
        ])
      )
    })

    test('should contain `setMyBusinessUnitAssociateRoleOnCreation` action', () => {
      expect(myBusinessUnitActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setMyBusinessUnitAssociateRoleOnCreation',
            key: 'associateRole',
          },
        ])
      )
    })

    test('should contain `changeCustomerSearchStatus` action', () => {
      expect(customerSearchActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeCustomerSearchStatus',
            key: 'status',
          },
        ])
      )
    })
  })
})

describe('Actions', () => {
  let projectsSync
  beforeEach(() => {
    projectsSync = createProjectsSync()
  })

  test('should build `changeName` action', () => {
    const before = { name: 'nameBefore' }
    const now = { name: 'nameAfter' }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeName',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeCurrencies` action', () => {
    const before = { currencies: ['EUR', 'Dollar'] }
    const now = { currencies: ['EUR'] }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeCurrencies',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeCountries` action', () => {
    const before = { countries: ['Germany', 'Spain'] }
    const now = { countries: ['Germany'] }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeCountries',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeLanguages` action', () => {
    const before = { languages: ['German', 'Dutch'] }
    const now = { languages: ['Dutch'] }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeLanguages',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  describe('setShippingRateInputType', () => {
    describe('given `shippingRateInputType` is of type `CartClassification`', () => {
      const before = {
        shippingRateInputType: {
          type: 'CartClassification',
          values: [
            { key: 'Small', label: { en: 'Small', de: 'Klein' } },
            { key: 'Medium', label: { en: 'Medium', de: 'Mittel' } },
            { key: 'Heavy', label: { en: 'Heavy', de: 'Schwergut' } },
          ],
        },
      }
      describe('given a value of `values` changes', () => {
        const now = {
          shippingRateInputType: {
            type: 'CartClassification',
            values: [
              { key: 'Small', label: { en: 'Small', de: 'Klein' } },
              { key: 'Medium', label: { en: 'Medium', de: 'Mittel' } },
              { key: 'Big', label: { en: 'Big', de: 'Groß' } },
            ],
          },
        }

        test('should build `setShippingRateInputType` action', () => {
          const actual = projectsSync.buildActions(now, before)
          const expected = [
            {
              action: 'setShippingRateInputType',
              ...now,
            },
          ]
          expect(actual).toEqual(expected)
        })
      })
      describe('given type changes to `CartValue`', () => {
        let now = {
          shippingRateInputType: {
            type: 'CartValue',
          },
        }

        test('should build `setShippingRateInputType` action', () => {
          const actual = projectsSync.buildActions(now, before)
          const expected = [
            {
              action: 'setShippingRateInputType',
              ...now,
            },
          ]
          expect(actual).toEqual(expected)
        })

        describe('given type changes to `CartScore`', () => {
          now = {
            shippingRateInputType: {
              type: 'CartScore',
            },
          }

          test('should build `setShippingRateInputType` action', () => {
            const actual = projectsSync.buildActions(now, before)
            const expected = [
              {
                action: 'setShippingRateInputType',
                ...now,
              },
            ]
            expect(actual).toEqual(expected)
          })
        })
      })
    })
  })

  test('should build `changeMessagesConfiguration` action', () => {
    const before = { messagesConfiguration: { type: 'some-config' } }
    const now = { messagesConfiguration: { type: 'some-other-config' } }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeMessagesConfiguration',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeMyBusinessUnitStatusOnCreation` action', () => {
    const actionGroupList = [
      { type: 'base', group: 'allow' },
      { type: 'myBusinessUnit', group: 'allow' },
      { type: 'customerSearch', group: 'ignore' },
    ]
    projectsSync = createProjectsSync(actionGroupList)
    const before = { status: 'Active' }
    const now = { status: 'Deactive' }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeMyBusinessUnitStatusOnCreation',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setMyBusinessUnitAssociateRoleOnCreation` action', () => {
    const before = {
      associateRole: {
        typeId: 'associate-role',
        key: 'old-role',
      },
    }
    const now = {
      associateRole: {
        typeId: 'associate-role',
        key: 'new-role',
      },
    }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setMyBusinessUnitAssociateRoleOnCreation',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeCustomerSearchStatus` action', () => {
    const actionGroupList = [
      { type: 'base', group: 'allow' },
      { type: 'myBusinessUnit', group: 'ignore' },
      { type: 'customerSearch', group: 'allow' },
    ]
    projectsSync = createProjectsSync(actionGroupList)
    const before = {
      action: 'changeCustomerSearchStatus',
      status: 'Activated',
    }
    const now = {
      action: 'changeCustomerSearchStatus',
      status: 'Deactivated',
    }
    const actual = projectsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeCustomerSearchStatus',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
