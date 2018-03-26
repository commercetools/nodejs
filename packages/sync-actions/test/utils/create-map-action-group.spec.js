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
    describe('with `group` being `white`', () => {
      const fn = jest.fn()
      const actionGroups = [{ type: 'base', group: 'white' }]
      let mapActionGroup

      beforeEach(() => {
        mapActionGroup = createMapActionGroup(actionGroups)
        mapActionGroup(actionGroups[0].type, fn)
      })

      test('should invoke the `fn` (callback)', () => {
        expect(fn).toHaveBeenCalled()
      })
    })

    describe('with `group` being `black`', () => {
      const fn = jest.fn()
      const actionGroups = [{ type: 'base', group: 'black' }]
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
        }).toThrowError(
          `Action group '${actionGroups[0].group}' ` +
            'not supported. Please use black or white.'
        )
      })
    })
  })

  describe('with non found `actionGroup` (type)', () => {
    const fn = jest.fn()
    const actionGroups = [{ type: 'base', group: 'white' }]
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
