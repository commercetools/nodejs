/* @flow */
import type {
  UserAgentMiddlewareOptions,
} from 'types/sdk'
/* global window */

const sdkInfo = 'commercetools-node-sdk' // version is not necessary
// TODO: should this be configurable?
const helpdesk = 'helpdesk@commercetools.com'

export default function createUserAgent (
  options: UserAgentMiddlewareOptions = {},
  windowObject: Object = window,
): string {
  let libraryInfo
  if (options.name && !options.version)
    libraryInfo = options.name
  else if (options.name && options.version)
    libraryInfo = `${options.name}/${options.version}`
  const libraryUrl = options.url

  const solutionContactInfo = libraryUrl
    ? `+${libraryUrl}; +${helpdesk}`
    : `+${helpdesk}`
  const solutionInfo = libraryInfo
    ? `${libraryInfo} (${solutionContactInfo})`
    : `(${solutionContactInfo})`
  const systemInfo = getSystemInfo(windowObject)

  return `${sdkInfo} ${systemInfo} ${solutionInfo}`
}

function getSystemInfo (windowObject: Object): string {
  if (windowObject && windowObject.navigator)
    return windowObject.navigator.userAgent

  const nodeVersion = process.version.slice(1)
  const platformInfo = `(${process.platform}; ${process.arch})`
  return `Node.js/${nodeVersion} ${platformInfo}`
}
