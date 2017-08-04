import { METHODS } from 'http'

export default function validate (
  funcName: string,
  request: Object,
  options: Object = { allowedMethods: METHODS },
) {
  if (!request)
    // eslint-disable-next-line max-len
    throw new Error(`The "${funcName}" function requires a "Request" object as an argument. See https://commercetools.github.io/nodejs/sdk/Glossary.html#clientrequest`)

  if (typeof request.uri !== 'string')
    // eslint-disable-next-line max-len
    throw new Error(`The "${funcName}" Request object requires a valid uri. See https://commercetools.github.io/nodejs/sdk/Glossary.html#clientrequest`)

  if (!options.allowedMethods.includes(request.method))
    // eslint-disable-next-line max-len
    throw new Error(`The "${funcName}" Request object requires a valid method. See https://commercetools.github.io/nodejs/sdk/Glossary.html#clientrequest`)
}
