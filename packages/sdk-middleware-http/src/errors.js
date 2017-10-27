function defineError(statusCode, message, meta = {}) {
  // eslint-disable-next-line no-multi-assign
  this.status = this.statusCode = this.code = statusCode;
  this.message = message;
  Object.assign(this, meta);

  this.name = this.constructor.name;
  // eslint-disable-next-line no-proto
  this.constructor.prototype.__proto__ = Error.prototype;

  if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
}

/* eslint-disable max-len, flowtype/require-parameter-type */
export function NetworkError(...args) {
  defineError.call(
    this,
    0 /* special code to indicate network errors */,
    ...args
  );
}
export function HttpError(...args) {
  defineError.call(this, /* code will be passed as arg */ ...args);
}
export function BadRequest(...args) {
  defineError.call(this, 400, ...args);
}
export function Unauthorized(...args) {
  defineError.call(this, 401, ...args);
}
export function Forbidden(...args) {
  defineError.call(this, 403, ...args);
}
export function NotFound(...args) {
  defineError.call(this, 404, ...args);
}
export function ConcurrentModification(...args) {
  defineError.call(this, 409, ...args);
}
export function InternalServerError(...args) {
  defineError.call(this, 500, ...args);
}
export function ServiceUnavailable(...args) {
  defineError.call(this, 503, ...args);
}
/* eslint-enable max-len */

export default function getErrorByCode(code) {
  switch (code) {
    case 0:
      return NetworkError;
    case 400:
      return BadRequest;
    case 401:
      return Unauthorized;
    case 403:
      return Forbidden;
    case 404:
      return NotFound;
    case 409:
      return ConcurrentModification;
    case 500:
      return InternalServerError;
    case 503:
      return ServiceUnavailable;
    default:
      return undefined;
  }
}
