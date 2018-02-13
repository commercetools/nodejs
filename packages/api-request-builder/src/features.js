/**
 * NOTE:
 *  These are so called implicit features
 *  which work on endpoints automatically as they only
 *  differ in the http method and request body
 *  and do not need any further processing.
 *  We specify these on endpoints for documentation purposes
 *  only.
 */
export const create = 'create'
export const update = 'update'
// `delete` is a reserved word in JavaScript
export const del = 'delete'

/**
 * NOTE:
 *  These are so called explicit features
 *  which only work on a subset of endpoints and perform
 *  additional manipulation on the request.
 */
export const query = 'query'
export const queryOne = 'queryOne'
export const queryExpand = 'queryExpand'
export const queryLocation = 'queryLocation'
export const search = 'search'
export const projection = 'projection'
export const suggest = 'suggest'
