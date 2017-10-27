import streamtest from 'streamtest';
import { stripIndent } from 'common-tags';
import DiscountCodeExport from '../src/main';

describe('DiscountCodeExport', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  };

  let codeExport;
  beforeEach(() => {
    codeExport = new DiscountCodeExport(
      {
        apiConfig: {
          projectKey: 'test-project-key',
        },
      },
      logger
    );
  });

  describe('::constructor', () => {
    it('should be a function', () => {
      expect(typeof DiscountCodeExport).toBe('function');
    });

    it('should set default properties', () => {
      expect(codeExport.apiConfig).toEqual({
        projectKey: 'test-project-key',
      });
      expect(codeExport.logger).toEqual(logger);
      expect(codeExport.config.batchSize).toBe(500);
      expect(codeExport.config.delimiter).toBe(',');
      expect(codeExport.config.multiValueDelimiter).toBe(';');
    });

    it('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new DiscountCodeExport({ foo: 'bar' })).toThrow(
        /The contructor must be passed an `apiConfig` object/
      );
    });

    it('should throw if `batchSize` is more than 500', () => {
      expect(
        () =>
          new DiscountCodeExport(
            {
              apiConfig: {},
              batchSize: 501,
            },
            logger
          )
      ).toThrow(/The `batchSize` must not be more than 500/);
    });
  });

  describe('::run', () => {
    it('should fetch discount codes and output csv to stream', done => {
      codeExport.config.exportFormat = 'csv';
      const sampleCode = {
        code: 'discount-code',
        name: { en: 'some-discount-name' },
        cartDiscounts: [{ id: 'cart-discount-1' }, { id: 'cart-discount-2' }],
      };
      codeExport._fetchCodes = jest.fn().mockImplementation(csvStream => {
        csvStream.write(sampleCode);
        return Promise.resolve();
      });
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = stripIndent`
          code,name.en,cartDiscounts
          discount-code,some-discount-name,cart-discount-1;cart-discount-2
          `;
        expect(result).toEqual(expectedResult);
        done();
      });
      codeExport.run(outputStream);
    });

    it('should fetch codes and output json to stream by default', done => {
      const sampleCode = {
        code: 'discount-code',
        name: { en: 'some-discount-name' },
        cartDiscounts: [{ id: 'cart-discount-1' }, { id: 'cart-discount-2' }],
      };
      codeExport._fetchCodes = jest.fn().mockImplementation(jsonStream => {
        jsonStream.write(sampleCode);
        return Promise.resolve();
      });
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = [sampleCode];
        expect(JSON.parse(result)).toEqual(expectedResult);
        done();
      });
      codeExport.run(outputStream);
    });

    it('should emit error if it occurs when streaming to csv', done => {
      codeExport.exportFormat = 'csv';
      codeExport._fetchCodes = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('error occured')));
      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured');
        expect(result).toBeUndefined();
        done();
      });
      codeExport.run(outputStream);
    });

    it('should emit error if it occurs when streaming to json', done => {
      codeExport._fetchCodes = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('error occured')));
      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured');
        expect(result).toBeUndefined();
        done();
      });
      codeExport.run(outputStream);
    });
  });

  describe('::_fetchCodes', () => {
    let processMock;
    const sampleResult = {
      body: {
        results: [],
      },
    };
    beforeEach(() => {
      processMock = jest.fn((request, processFn) =>
        processFn(sampleResult).then(() => Promise.resolve())
      );
    });

    it('should fail if status code is not 200', async () => {
      codeExport.client.process = processMock;
      sampleResult.message = 'Error occured';
      try {
        await codeExport._fetchCodes();
      } catch (error) {
        expect(error.message).toBe('Error occured');
      }
    });

    it('should fetch discount codes using `process` method', async () => {
      codeExport.client.process = processMock;
      sampleResult.statusCode = 200;
      await codeExport._fetchCodes();
      expect(processMock).toHaveBeenCalledTimes(1);
      expect(processMock.mock.calls[0][0]).toEqual({
        uri: '/test-project-key/discount-codes?limit=500',
        method: 'GET',
      });
    });

    it('should loop over discount codes and write to stream', async () => {
      codeExport.client.process = processMock;
      sampleResult.statusCode = 200;
      sampleResult.body.results = ['code1', 'code2', 'code3'];
      const fakeStream = { write: jest.fn() };
      await codeExport._fetchCodes(fakeStream);
      expect(fakeStream.write).toHaveBeenCalledTimes(3);
    });
  });

  describe('::_buildRequest', () => {
    it('should build request according to query', () => {
      codeExport.config.predicate = 'code-predicate';
      codeExport.config.accessToken = 'myAccessToken';
      const expected = {
        uri: '/test-project-key/discount-codes?where=code-predicate&limit=500',
        method: 'GET',
        headers: {
          Authorization: 'Bearer myAccessToken',
        },
      };
      const actual = codeExport._buildRequest();
      expect(actual).toEqual(expected);
    });
  });

  describe('::_processCode', () => {
    let sampleCodeObj;
    beforeEach(() => {
      sampleCodeObj = {
        name: { en: 'English', de: 'German' },
        cartDiscounts: [
          {
            typeId: 'cart-discount',
            id: 'discount-id-1',
          },
        ],
        attributeTypes: {},
        cartFieldTypes: {},
        lineItemFieldTypes: {},
        customLineItemFieldTypes: {},
      };
    });

    it('deletes empty objects and ignores non-empty objects', () => {
      sampleCodeObj.attributeTypes = { foo: 'bar' };
      const expected = {
        'name.en': 'English',
        'name.de': 'German',
        cartDiscounts: 'discount-id-1',
        'attributeTypes.foo': 'bar',
      };
      const actual = codeExport._processCode(sampleCodeObj);
      expect(actual).toEqual(expected);
    });

    it('flatten object and return the `cartDiscounts` id as a string', () => {
      const expected = {
        'name.en': 'English',
        'name.de': 'German',
        cartDiscounts: 'discount-id-1',
      };
      const actual = codeExport._processCode(sampleCodeObj);
      expect(actual).toEqual(expected);
    });

    it('should concatenate multiple `cartDiscounts` ids', () => {
      sampleCodeObj.cartDiscounts.push({
        typeId: 'cart-discount',
        id: 'discount-id-2',
      });
      const expected = {
        'name.en': 'English',
        'name.de': 'German',
        cartDiscounts: 'discount-id-1;discount-id-2',
      };
      const actual = codeExport._processCode(sampleCodeObj);
      expect(actual).toEqual(expected);
    });
  });
});
