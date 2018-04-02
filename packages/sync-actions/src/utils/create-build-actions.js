import isEqual from 'lodash.isequal'

function applyOnBeforeDiff(before, now, fn) {
  return fn && typeof fn === 'function' ? fn(before, now) : [before, now]
}

const createPriceComparator = price => ({
  value: { currencyCode: price.value.currencyCode },
  channel: price.channel,
  country: price.country,
  customerGroup: price.customerGroup,
  validFrom: price.validFrom,
  validUntil: price.validUntil,
})

function arePricesStructurallyEqual(oldPrice, newPrice) {
  const oldPriceComparison = createPriceComparator(oldPrice)
  const newPriceComparison = createPriceComparator(newPrice)
  return isEqual(newPriceComparison, oldPriceComparison)
}

function extractPriceIdFromPreviousVariant(newPrice, previousVariants) {
  let newPriceId

  previousVariants.forEach(variant => {
    variant.prices.find(oldPrice => {
      if (arePricesStructurallyEqual(oldPrice, newPrice)) {
        newPriceId = oldPrice.id
        return true
      }
      return false
    })
  })

  return newPriceId
}

function injectMissingPriceIds(nextVariants, previousVariants) {
  return nextVariants.map(newVariant => {
    const { prices, ...restOfVariant } = newVariant

    if (!prices) return restOfVariant

    return {
      ...restOfVariant,
      prices: prices.map(price => {
        if (!price.id) {
          const id = extractPriceIdFromPreviousVariant(price, previousVariants)
          if (id) return { ...price, id }
        }
        return price
      }),
    }
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
      processedNow.variants = injectMissingPriceIds(
        processedNow.variants,
        processedBefore.variants
      )

    const diffed = differ(processedBefore, processedNow)

    if (!diffed) return []

    return doMapActions(diffed, processedNow, processedBefore, options)
  }
}
