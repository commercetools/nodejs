export default function removeTypename(obj) {
  const { __typename, ...objWithoutTypename } = obj
  return objWithoutTypename
}
