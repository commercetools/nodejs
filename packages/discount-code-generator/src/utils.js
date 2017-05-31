import { Transform } from 'stream'

// Implement a transform stream to correctly parse boolean and number types
// from the CSV. This is necessary because the csv-parser parses all fields
// as strings
export class CsvTransform extends Transform {
  constructor (typeCast = {}) {
    super({ objectMode: true })
    this.typeCast = typeCast
  }

  _transform (chunk, enc, callback) {
    Object.keys(this.typeCast).forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(chunk, field))
        // eslint-disable-next-line no-param-reassign
        chunk[field] = this.typeCast[field](chunk[field])
    })
    this.push(chunk)
    callback()
  }
}

export function parseBool (value) {
  return value === 'true' || value === true
}
