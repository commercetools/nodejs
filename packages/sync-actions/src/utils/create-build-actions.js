import isEqual from 'lodash.isequal'

function applyOnBeforeDiff(before, now, fn) {
  return fn && typeof fn === 'function' ? fn(before, now) : [before, now]
}

function addPriceId(newPrice, beforeVariantArray) {
  let getId = ''
  const comparisonNewPrice = {
    value: { currencyCode: newPrice.value.currencyCode },
    channel: newPrice.channel,
    country: newPrice.country,
    customerGroup: newPrice.customerGroup,
  }

  beforeVariantArray.map(variant =>
    variant.prices.find(oldPrice => {
      const { value, channel, country, customerGroup } = oldPrice

      const comparisonOldPrice = {
        value: { currencyCode: value.currencyCode },
        channel,
        country,
        customerGroup,
      }
      if (isEqual(comparisonNewPrice, comparisonOldPrice)) {
        getId = oldPrice.id
        return true
      }
      return false
    })
  )

  return getId
}

function isThereAMissingPriceId(nowVariantArray, beforeVariantArray) {
  nowVariantArray.map(variant => {
    if (!variant.prices) return variant
    return variant.prices.map(price => {
      const priceWithId = price
      if (!priceWithId.id) {
        const id = addPriceId(price, beforeVariantArray)
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

    if (processedNow.variants)
      isThereAMissingPriceId(processedNow.variants, processedBefore.variants)

    const diffed = differ(processedBefore, processedNow)

    if (!diffed) return []

    return doMapActions(diffed, processedNow, processedBefore, options)
  }
}
