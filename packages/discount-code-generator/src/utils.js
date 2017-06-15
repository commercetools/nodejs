// Implement a function to correctly cast boolean and number types from the CSV
// input and handle the `cartDiscounts` field.
// This is necessary because the csv-parser parses all fields as strings
export default function prepareInput (object, arrayDelim) {
  if (object.isActive)
    // eslint-disable-next-line no-param-reassign
    object.isActive = _parseBool(object.isActive)
  if (object.maxApplications)
    // eslint-disable-next-line no-param-reassign
    object.maxApplications = parseInt(object.maxApplications, 10)
  if (object.maxApplicationsPerCustomer)
    // eslint-disable-next-line no-param-reassign
    object.maxApplicationsPerCustomer = parseInt(
      object.maxApplicationsPerCustomer, 10,
    )
  if (object.cartDiscounts)
    // eslint-disable-next-line no-param-reassign
    object.cartDiscounts = _formatCartDiscountInput(
      object.cartDiscounts, arrayDelim,
    )
  return object
}

function _parseBool (value) {
  return value === 'true' || value === true
}

function _formatCartDiscountInput (cartDiscounts, arrayDelim) {
  return cartDiscounts
    .split(arrayDelim)
    .map(cartDiscount => (
      {
        typeId: 'cart-discount',
        id: cartDiscount,
      }
    ))
}
