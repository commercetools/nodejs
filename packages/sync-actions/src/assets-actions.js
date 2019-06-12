import flatten from 'lodash.flatten'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)

function createRemoveAssetAction(delta) {
  const assetIdentifier = asset =>
    asset.id ? { assetId: asset.id } : { assetKey: asset.key }
  const action = Object.assign(
    { action: 'removeAsset' },
    assetIdentifier(delta[0])
  )
  return action
}

function createAddAssetAction(delta) {
  const asset = delta[0]
  const action = { action: 'addAsset', asset }
  return action
}

export default function actionsMapAssets(diff) {
  // }, nextObject, previousObject) {
  const { assets } = diff
  const assetsActions = []

  if (assets && assets._t === 'a') {
    const keys = Object.keys(assets)
    const changeDeltas = keys
      .filter(key => REGEX_NUMBER.test(key))
      .map(key => assets[key])
    const addAssetActions = changeDeltas.map(createAddAssetAction)
    assetsActions.push(addAssetActions)

    const removeDeltas = keys
      .filter(key => REGEX_UNDERSCORE_NUMBER.test(key))
      .map(key => assets[key])
    const removeAssetActions = removeDeltas.map(createRemoveAssetAction)
    assetsActions.push(removeAssetActions)
  } else if (Array.isArray(assets)) {
    const assetActions = diff.assets.map(assetDiff => {
      let assetAction
      if (Array.isArray(assetDiff)) {
        const asset = assetDiff[0]

        if (assetDiff.length === 1) {
          assetAction = {
            action: 'addAsset',
            asset,
          }
        }
      }
      return assetAction
    })
    assetsActions.push(assetActions)
  }
  return flatten(assetsActions)
}
