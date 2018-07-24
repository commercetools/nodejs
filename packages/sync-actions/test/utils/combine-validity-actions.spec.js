import combineValidityActions from '../../src/utils/combine-validity-actions'

describe('combineValidityActions', () => {
  let combinedActions
  let validFromAction
  let validUntilAction
  let otherAction
  beforeEach(() => {
    validFromAction = {
      action: 'setValidFrom',
      validFrom: 'date-from-1',
    }
    validUntilAction = {
      action: 'setValidUntil',
      validUntil: 'date-until-1',
    }
    otherAction = {
      action: 'changeRequiresDiscountCode',
      requiresDiscountCode: true,
    }
  })
  describe('when both `setValidFrom` and `setValidUntil` available', () => {
    beforeEach(() => {
      combinedActions = combineValidityActions([
        otherAction,
        validFromAction,
        validUntilAction,
      ])
    })
    it('should combine both actions into `setValidFromAndUntil` action', () => {
      expect(combinedActions).toMatchObject([
        otherAction,
        {
          action: 'setValidFromAndUntil',
          validFrom: validFromAction.validFrom,
          validUntil: validUntilAction.validUntil,
        },
      ])
    })
  })
  describe('when only `setValidFrom` is available', () => {
    beforeEach(() => {
      combinedActions = combineValidityActions([otherAction, validFromAction])
    })
    it('should not combine into `setValidFromAndUntil` and keep `validFromAction`', () => {
      expect(combinedActions).toMatchObject([otherAction, validFromAction])
    })
  })
  describe('when only `setValidUntil` is available', () => {
    beforeEach(() => {
      combinedActions = combineValidityActions([otherAction, validUntilAction])
    })
    it('should not combine into `setValidFromAndUntil` and keep `validUntilAction`', () => {
      expect(combinedActions).toMatchObject([otherAction, validUntilAction])
    })
  })
  describe('when neither `setValidFrom` nor `setValidUntil` are available', () => {
    beforeEach(() => {
      combinedActions = combineValidityActions([otherAction])
    })
    it('should return same actions without any change', () => {
      expect(combinedActions).toMatchObject([otherAction])
    })
  })
})
