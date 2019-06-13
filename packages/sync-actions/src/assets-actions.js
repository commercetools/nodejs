import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'

function toAssetIdentifier(asset) {
  const assetIdentifier = asset.id
    ? { assetId: asset.id }
    : { assetKey: asset.key }
  return assetIdentifier
}

export default function actionsMapAssets(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('assets', {
    [ADD_ACTIONS]: newAsset => ({
      action: 'addAsset',
      asset: newAsset,
    }),
    [REMOVE_ACTIONS]: oldAsset => ({
      action: 'removeAsset',
      ...toAssetIdentifier(oldAsset),
    }),
    [CHANGE_ACTIONS]: (oldAsset, newAsset) => {
      const result = []
      result.push({
        action: 'removeAsset',
        ...toAssetIdentifier(oldAsset),
      })

      result.push({
        action: 'addAsset',
        asset: newAsset,
      })

      return result
    },
  })

  return handler(diff, oldObj, newObj)
}
