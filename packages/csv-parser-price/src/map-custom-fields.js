import CONSTANTS from './constants'

export default (function MapCustomFields() {
  function isValidValue(value) {
    return typeof value === 'string' && value.length > 0
  }

  function processError(errors, rowIndex, customTypeKey) {
    if (!Array.isArray(errors))
      return new Error(`[row ${rowIndex}: ${customTypeKey}] - ${errors}`)

    return errors.reduce((prev, curr) => {
      prev.push(new Error(`[row ${rowIndex}: ${customTypeKey}] - ${curr}`))
      return prev
    }, [])
  }

  function parse(data, customType, rowIndex) {
    const custom = {
      type: {
        id: customType.id,
      },
      fields: {},
    }
    const result = {
      error: [],
      data: custom,
    }

    Object.keys(data).forEach(key => {
      const value = data[key]

      customType.fieldDefinitions.forEach(fieldDef => {
        if (fieldDef.name === key)
          switch (fieldDef.type.name) {
            case 'Number': {
              const _result = this.mapNumber(value)
              if (_result.error)
                result.error.push(
                  processError(_result.error, rowIndex, customType.key)
                )
              if (!(_result.data === undefined))
                custom.fields[key] = _result.data
              break
            }
            case 'Boolean': {
              const _result = this.mapBoolean(value)
              if (_result.error)
                result.error.push(
                  processError(_result.error, rowIndex, customType.key)
                )
              if (!(_result.data === undefined))
                custom.fields[key] = _result.data
              break
            }
            case 'Money': {
              const _result = this.mapMoney(value)
              if (_result.error)
                result.error.push(
                  processError(_result.error, rowIndex, customType.key)
                )
              if (!(_result.data === undefined))
                custom.fields[key] = _result.data
              break
            }
            case 'Set': {
              const _result = this.mapSet(value, fieldDef.type.elementType)
              if (_result.error.length)
                result.error.push(
                  ...processError(_result.error, rowIndex, customType.key)
                )
              if (_result.data.length) custom.fields[key] = _result.data
              break
            }
            case 'String':
            case 'Enum':
            case 'LocalizedEnum':
            case 'LocalizedString':
            case 'Date':
            case 'Time':
            case 'DateTime':
            case 'Reference': {
              if (!(value === undefined)) custom.fields[key] = value
              break
            }
            default: {
              const unsupportedMsg = `'${fieldDef.type
                .name}' type is not supported! Kindly raise an issue for this`
              result.error.push(
                new Error(
                  `[row ${rowIndex}: ${customType.key}] - ${unsupportedMsg}`
                )
              )
            }
          }
      })
    })
    return result
  }

  function mapBoolean(value) {
    const result = {}
    if (!isValidValue(value)) return result
    const _value = value.trim()
    const errorMsg = `The value '${_value}' is not a valid boolean value`
    try {
      const b = JSON.parse(_value.toLowerCase())
      if (!(typeof b === 'boolean')) {
        result.error = errorMsg
        return result
      }
      result.data = b
      return result
    } catch (error) {
      result.error = errorMsg
      return result
    }
  }

  function mapMoney(value) {
    const result = {}
    if (!isValidValue(value)) return result

    const matchedMoney = CONSTANTS.field.money.exec(value)
    if (!matchedMoney) {
      result.error = `Invalid money - Cannot parse money ${value}`
      return result
    }

    result.data = {
      currencyCode: matchedMoney[1].toUpperCase(),
      centAmount: parseInt(matchedMoney[2], 10),
    }
    return result
  }

  function mapSet(value, elementType) {
    const result = {
      error: [],
      data: [],
    }
    const values = value.split(',')
    const _result = values.map(item => {
      const _item = item.trim()
      switch (elementType.name) {
        case 'Number': {
          return this.mapNumber(_item)
        }
        case 'Boolean': {
          return this.mapBoolean(_item)
        }
        case 'Money': {
          return this.mapMoney(_item)
        }
        case 'String':
        case 'Enum':
        case 'LocalizedEnum':
        case 'Date':
        case 'Time':
        case 'DateTime':
        case 'Reference': {
          return {
            data: _item,
          }
        }
        default: {
          const unsupportedMsg = `'${elementType.name}' type is not supported! Kindly raise an issue for this`
          return {
            error: unsupportedMsg,
          }
        }
      }
    })

    return _result.reduce((prev, curr) => {
      if (curr.error) prev.error.push(curr.error)
      if (!(curr.data === undefined)) prev.data.push(curr.data)
      return prev
    }, result)
  }

  function mapNumber(rawNo) {
    const result = {}
    if (!isValidValue(rawNo)) return result

    if (Number.isNaN(Number(rawNo))) {
      result.error = `The number ${rawNo} isn't valid`
      return result
    }
    result.data = Number(rawNo)
    return result
  }

  // Public methods
  return {
    parse,
    mapBoolean,
    mapMoney,
    mapSet,
    mapNumber,
  }
})()
