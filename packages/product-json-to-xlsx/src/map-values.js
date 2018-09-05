/* @flow */

type HeaderObj = {
  label: string,
  value: string,
}

export default function mapValues(
  headers: Array<HeaderObj>,
  mappedProduct: Object
): Array<any> {
  return headers.map(
    (header: HeaderObj): any => mappedProduct[header.value] || ''
  )
}
