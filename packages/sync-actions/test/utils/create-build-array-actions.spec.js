import { diff } from '../../src/utils/diffpatcher'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from '../../src/utils/create-build-array-actions'

const testObjKey = 'someNestedObjects'
const getTestObj = list => ({ [testObjKey]: list || [] })

describe('createBuildArrayActions', () => {
  test('returns function', () => {
    expect(typeof createBuildArrayActions('test', {})).toBe('function')
  })

  test('correctly detects add actions', () => {
    const before = getTestObj()
    const now = getTestObj([{ name: 'a new object' }])
    const addActionSpy = jest.fn()

    const handler = createBuildArrayActions(testObjKey, {
      [ADD_ACTIONS]: addActionSpy,
    })

    handler(diff(before, now), before, now)

    expect(addActionSpy).toHaveBeenCalledWith(
      { name: 'a new object' },
      expect.any(Number)
    )

    expect(addActionSpy).toHaveBeenCalledWith(expect.any(Object), 0)
  })

  test('correctly detects change actions', () => {
    const before = getTestObj([{ name: 'a new object' }])
    const now = getTestObj([{ name: 'a changed object' }])
    const changeActionSpy = jest.fn()

    const handler = createBuildArrayActions(testObjKey, {
      [CHANGE_ACTIONS]: changeActionSpy,
    })

    handler(diff(before, now), before, now)

    expect(changeActionSpy).toHaveBeenCalledWith(
      { name: 'a new object' },
      { name: 'a changed object' },
      expect.any(Number)
    )

    expect(changeActionSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      0
    )
  })

  test('correctly detects remove actions', () => {
    const before = getTestObj([{ name: 'an object' }])
    const now = getTestObj()
    const removeActionSpy = jest.fn()

    const handler = createBuildArrayActions(testObjKey, {
      [REMOVE_ACTIONS]: removeActionSpy,
    })

    handler(diff(before, now), before, now)

    expect(removeActionSpy).toHaveBeenCalledWith(
      { name: 'an object' },
      expect.any(Number)
    )

    expect(removeActionSpy).toHaveBeenCalledWith(expect.any(Object), 0)
  })
})
