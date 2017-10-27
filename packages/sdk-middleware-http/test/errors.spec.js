import getErrorByCode, {
  NetworkError,
  HttpError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  ConcurrentModification,
  InternalServerError,
  ServiceUnavailable,
} from '../src/errors';

describe('errors', () => {
  it('map error type by status code (BadRequest)', () => {
    expect(getErrorByCode(400)).toBe(BadRequest);
    expect(new BadRequest('foo').status).toBe(400);
  });
  it('map error type by status code (Unauthorized)', () => {
    expect(getErrorByCode(401)).toBe(Unauthorized);
    expect(new Unauthorized('foo').status).toBe(401);
  });
  it('map error type by status code (Forbidden)', () => {
    expect(getErrorByCode(403)).toBe(Forbidden);
    expect(new Forbidden('foo').status).toBe(403);
  });
  it('map error type by status code (NotFound)', () => {
    expect(getErrorByCode(404)).toBe(NotFound);
    expect(new NotFound('foo').status).toBe(404);
  });
  it('map error type by status code (ConcurrentModification)', () => {
    expect(getErrorByCode(409)).toBe(ConcurrentModification);
    expect(new ConcurrentModification('foo').status).toBe(409);
  });
  it('map error type by status code (InternalServerError)', () => {
    expect(getErrorByCode(500)).toBe(InternalServerError);
    expect(new InternalServerError('foo').status).toBe(500);
  });
  it('map error type by status code (ServiceUnavailable)', () => {
    expect(getErrorByCode(503)).toBe(ServiceUnavailable);
    expect(new ServiceUnavailable('foo').status).toBe(503);
  });
  it('map error type by status code (NetworkError)', () => {
    expect(getErrorByCode(0)).toBe(NetworkError);
    expect(new NetworkError('foo').status).toBe(0);
  });
  it('map error type by status code (undefined)', () => {
    expect(getErrorByCode(1)).toBeUndefined();
  });
  it('define HttpError', () => {
    expect(new HttpError(415, 'foo').status).toBe(415);
  });
});
