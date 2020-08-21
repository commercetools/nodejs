import createMapActionGroup from '../../src/utils/create-map-action-group'

describe('createMapActionGroup', () => {
  describe('without actionGroups', () => {
    const fn = jest.fn()
    let mapActionGroup

    beforeEach(() => {
      mapActionGroup = createMapActionGroup([])
      mapActionGroup('foo-type', fn)
    })

    test('should invoke the `fn` (callback)', () => {
      expect(fn).toHaveBeenCalled()
    })
  })

  describe('with found `actionGroup` (type)', () => {
    describe('with `group` being `allow`', () => {
      const fn = jest.fn()
      const actionGroups = [{ type: 'base', group: 'allow' }]
      let mapActionGroup

      beforeEach(() => {
        mapActionGroup = createMapActionGroup(actionGroups)
        mapActionGroup(actionGroups[0].type, fn)
      })

      test('should invoke the `fn` (callback)', () => {
        expect(fn).toHaveBeenCalled()
      })
    })

    describe('with `group` being `ignore`', () => {
      const fn = jest.fn()
      const actionGroups = [{ type: 'base', group: 'ignore' }]
      let mapActionGroup

      beforeEach(() => {
        mapActionGroup = createMapActionGroup(actionGroups)
        mapActionGroup(actionGroups[0].type, fn)
      })

      test('should not invoke the `fn` (callback)', () => {
        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('without `group`', () => {
      const fn = jest.fn()
      const actionGroups = [{ type: 'base', group: 'grey' }]
      let mapActionGroup

      beforeEach(() => {
        mapActionGroup = createMapActionGroup(actionGroups)
      })

      test('should throw an error', () => {
        expect(() => {
          mapActionGroup(actionGroups[0].type, fn)
        }).toThrow()
      })

      test('should throw an error with message', () => {
        expect(() => {
          mapActionGroup(actionGroups[0].type, fn)
        }).toThrow(
          `Action group '${actionGroups[0].group}' ` +
            'not supported. Use either "allow" or "ignore".'
        )
      })
    })
  })

  describe('with non found `actionGroup` (type)', () => {
    const fn = jest.fn()
    const actionGroups = [{ type: 'base', group: 'allow' }]
    let mapActionGroup

    beforeEach(() => {
      mapActionGroup = createMapActionGroup(actionGroups)
      mapActionGroup('foo-non-existent-type', fn)
    })

    test('should not invoke the `fn` (callback)', () => {
      expect(fn).not.toHaveBeenCalled()
    })
  })
})
