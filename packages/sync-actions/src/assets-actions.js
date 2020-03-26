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
    [ADD_ACTIONS]: (newAsset) => ({
      action: 'addAsset',
      asset: newAsset,
    }),
    [REMOVE_ACTIONS]: (oldAsset) => ({
      action: 'removeAsset',
      ...toAssetIdentifier(oldAsset),
    }),
    [CHANGE_ACTIONS]: (oldAsset, newAsset) =>
      // here we could use more atomic update actions (e.g. changeAssetName)
      // but for now we use the simpler approach to first remove and then
      // re-add the asset - which reduces the code complexity
      [
        {
          action: 'removeAsset',
          ...toAssetIdentifier(oldAsset),
        },
        {
          action: 'addAsset',
          asset: newAsset,
        },
      ],
  })

  return handler(diff, oldObj, newObj)
}
