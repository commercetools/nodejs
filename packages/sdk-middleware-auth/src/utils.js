export default function store (initVal) {
  let value = initVal
  return {
    get: () => value,
    set: (val) => {
      value = val
      return value
    },
  }
}
