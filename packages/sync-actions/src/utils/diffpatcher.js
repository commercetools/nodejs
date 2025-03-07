import * as jsondiffpatch from 'jsondiffpatch'

export function objectHash(obj, index) {
  const objIndex = `$$index:${index}`
  return typeof obj === 'object' && obj !== null
    ? obj.id || obj.name || obj.url || objIndex
    : objIndex
}

const diffpatcher = jsondiffpatch.create({
  objectHash,
  arrays: {
    // detect items moved inside the array
    detectMove: true,

    // value of items moved is not included in deltas
    includeValueOnMove: false,
  },
  textDiff: {
    /**
     * jsondiffpatch uses a very fine-grained diffing algorithm for long strings to easily identify
     * what changed between strings. However, we don't actually care about what changed, just
     * if the string changed at all. So we set the minimum length to diff to a very large number to avoid
     * using the very slow algorithm.
     * See https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md#text-diffs.
     */
    minLength: Number.MAX_SAFE_INTEGER,
  },
})

export function diff(oldObj, newObj) {
  return diffpatcher.diff(oldObj, newObj)
}

export function patch(obj, delta) {
  return diffpatcher.patch(obj, delta)
}

export function getDeltaValue(arr, originalObject) {
  if (!Array.isArray(arr))
    throw new Error('Expected array to extract delta value')

  if (arr.length === 1) return arr[0] // new

  if (arr.length === 2) return arr[1] // update

  if (arr.length === 3 && arr[2] === 0) return undefined // delete

  if (arr.length === 3 && arr[2] === 2) {
    // text diff
    if (!originalObject)
      throw new Error(
        'Cannot apply patch to long text diff. Missing original object.'
      )
    // try to apply patch to given object based on delta value
    return patch(originalObject, arr)
  }

  if (arr.length === 3 && arr[2] === 3)
    // array move
    throw new Error(
      'Detected an array move, it should not happen as ' +
        '`includeValueOnMove` should be set to false'
    )

  throw new Error(`Got unsupported number ${arr[2]} in delta value`)
}
