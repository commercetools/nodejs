export default function combineValidityActions(actions = []) {
  const [setValidFromAction, setValidUntilAction] = actions.filter(
    item => item.action === 'setValidFrom' || item.action === 'setValidUntil'
  )
  if (setValidFromAction && setValidUntilAction) {
    return [
      ...actions.filter(
        item =>
          !(item.action === 'setValidFrom' || item.action === 'setValidUntil')
      ),
      {
        action: 'setValidFromAndUntil',
        validFrom: setValidFromAction.validFrom,
        validUntil: setValidUntilAction.validUntil,
      },
    ]
  }
  return actions
}
