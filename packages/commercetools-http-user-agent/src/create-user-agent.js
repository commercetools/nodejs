/* @flow */
import type {
  HttpUserAgentOptions,
} from 'types/sdk'
/* global window */

export default function createUserAgent (
  options: HttpUserAgentOptions,
  windowObject: Object = window,
): string {
  if (
    !options ||
    Object.keys(options).length === 0 ||
    !{}.hasOwnProperty.call(options, 'name')
  )
    throw new Error('Missing required option `name`')

  // Main info
  const baseInfo = options.version
    ? `${options.name}/${options.version}`
    : options.name

  // Library info
  let libraryInfo
  if (options.libraryName && !options.libraryVersion)
    libraryInfo = options.libraryName
  else if (options.libraryName && options.libraryVersion)
    libraryInfo = `${options.libraryName}/${options.libraryVersion}`

  // Contact info
  let contactInfo
  if (options.contactUrl && !options.contactEmail)
    contactInfo = `(+${options.contactUrl})`
  else if (!options.contactUrl && options.contactEmail)
    contactInfo = `(+${options.contactEmail})`
  else if (options.contactUrl && options.contactEmail)
    contactInfo = `(+${options.contactUrl}; +${options.contactEmail})`

  // System info
  const systemInfo = getSystemInfo(windowObject)

  return [
    baseInfo,
    systemInfo,
    libraryInfo,
    contactInfo,
  ].filter((x: ?string): boolean => Boolean(x)).join(' ')
}

function getSystemInfo (windowObject: Object): string {
  if (windowObject && windowObject.navigator)
    return windowObject.navigator.userAgent

  const nodeVersion = process.version.slice(1)
  const platformInfo = `(${process.platform}; ${process.arch})`
  return `Node.js/${nodeVersion} ${platformInfo}`
}
