export default function extractMatchingPairs(hashMap, key, before, now) {
  let oldObjPos
  let newObjPos
  let oldObj
  let newObj

  if (hashMap[key]) {
    oldObjPos = hashMap[key][0]
    newObjPos = hashMap[key][1]
    if (before && before[oldObjPos]) oldObj = before[oldObjPos]

    if (now && now[newObjPos]) newObj = now[newObjPos]
  }

  return { oldObj, newObj }
}
