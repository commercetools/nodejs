import * as query from '../src/query';
import { getDefaultQueryParams } from '../src/default-params';

describe('query', () => {
  let service;

  beforeEach(() => {
    service = { params: getDefaultQueryParams(), ...query };
  });

  it('should set the where param', () => {
    service.where('name(en = "Foo Bar")');
    expect(service.params.query.where).toEqual([
      encodeURIComponent('name(en = "Foo Bar")'),
    ]);
  });

  it('should throw if predicate is missing', () => {
    expect(() => service.where()).toThrowError(
      /Required argument for `where` is missing/
    );
  });

  it('should set the whereOperator param', () => {
    service.whereOperator('or');
    expect(service.params.query.operator).toBe('or');

    service.whereOperator('and');
    expect(service.params.query.operator).toBe('and');
  });

  it('should throw if whereOperator is missing', () => {
    expect(() => service.whereOperator()).toThrowError(
      /Required argument for `whereOperator` is missing/
    );
  });

  it('should throw if whereOperator is wrong', () => {
    expect(() => service.whereOperator('foo')).toThrowError(
      // eslint-disable-next-line max-len
      /Required argument for `whereOperator` is invalid, allowed values are \(`and`, `or`\)/
    );
  });
});
