import isEqual from 'lodash.isequal'

function applyOnBeforeDiff(before, now, fn) {
  return fn && typeof fn === 'function' ? fn(before, now) : [before, now]
}

function isDateOverlap(
  oldValidFrom,
  oldValidUntil,
  newValidFrom,
  newValidUntil
) {
  if (newValidFrom > oldValidFrom && newValidFrom < oldValidUntil) return true
  if (newValidUntil < oldValidUntil && newValidUntil > oldValidFrom) return true
  return false
}

function getPriceId(newPrice, oldVariantArray) {
  let newPriceId = ''
  const newPriceComparison = {
    value: { currencyCode: newPrice.value.currencyCode },
    channel: newPrice.channel,
    country: newPrice.country,
    customerGroup: newPrice.customerGroup,
  }

  oldVariantArray.map(oldVariant =>
    oldVariant.prices.find(oldPrice => {
      const oldPriceComparison = {
        value: {
          currencyCode: oldPrice.value.currencyCode,
        },
        channel: oldPrice.channel,
        country: oldPrice.country,
        customerGroup: oldPrice.customerGroup,
      }

      if (
        isEqual(
          { ...newPriceComparison, validFrom: newPrice.validFrom },
          { ...oldPriceComparison, validFrom: oldPrice.validFrom }
        ) ||
        isEqual(
          { ...newPriceComparison, validUntil: newPrice.validUntil },
          { ...oldPriceComparison, validUntil: oldPrice.validUntil }
        ) ||
        (isEqual(newPriceComparison, oldPriceComparison) &&
          isDateOverlap(
            oldPrice.validFrom,
            oldPrice.validUntil,
            newPrice.validFrom,
            newPrice.validUntil
          ))
      ) {
        newPriceId = oldPrice.id
        return true
      }

      return false
    })
  )

  return newPriceId
}

function updateMissingPriceIds(newVariantArray, oldVariantArray) {
  // loop over and mutate newVariant price entry
  newVariantArray.map(newVariant => {
    if (!newVariant.prices) return newVariant
    return newVariant.prices.map(price => {
      const priceWithId = price
      if (!priceWithId.id) {
        const id = getPriceId(price, oldVariantArray)
        // reference original price entry and add id to it
        if (id) priceWithId.id = id
      }
      return priceWithId
    })
  })
}

export default function createBuildActions(differ, doMapActions, onBeforeDiff) {
  return function buildActions(now, before, options = {}) {
    if (!now || !before)
      throw new Error(
        'Missing either `newObj` or `oldObj` ' +
          'in order to build update actions'
      )

    const [processedBefore, processedNow] = applyOnBeforeDiff(
      before,
      now,
      onBeforeDiff
    )

    if (processedNow.variants && processedBefore.variants)
      // run updateMissingPriceIds function to mutate processedNow data
      updateMissingPriceIds(processedNow.variants, processedBefore.variants)

    const diffed = differ(processedBefore, processedNow)

    if (!diffed) return []

    return doMapActions(diffed, processedNow, processedBefore, options)
  }
}
