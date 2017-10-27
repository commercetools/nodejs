import streamtest from 'streamtest';
import { stripIndent } from 'common-tags';
import InventoryExporter from '../src/main';

describe('InventoryExporter', () => {
  it('should initialize with defaults', () => {
    const apiConfig = {
      projectKey: 'foo',
    };
    const inventoryExporter = new InventoryExporter(apiConfig);
    expect(inventoryExporter.logger).toBeDefined();
    expect(inventoryExporter.client).toBeDefined();
    expect(inventoryExporter.exportConfig).toBeDefined();
  });
  it('should extend logger object', () => {
    const apiConfig = {
      projectKey: 'foo',
    };
    const mockErrorLogger = jest.fn();
    const logger = {
      error: mockErrorLogger,
    };
    const inventoryExporter = new InventoryExporter(apiConfig, logger);
    inventoryExporter.logger.error();
    expect(inventoryExporter.logger.info).toBeDefined();
    expect(inventoryExporter.logger.warn).toBeDefined();
    expect(inventoryExporter.logger.verbose).toBeDefined();
    expect(mockErrorLogger).toHaveBeenCalled();
  });

  let inventoryExporter;
  const logger = {
    error: () => {},
    info: () => {},
    warn: () => {},
    verbose: () => {},
  };
  const apiConfig = {
    projectKey: 'foo',
  };
  beforeEach(() => {
    inventoryExporter = new InventoryExporter(apiConfig, logger);
  });
  describe('::_fetchInventories', () => {
    it('should resolve channel key if present', () => {
      const channelKey = 'qw84';
      inventoryExporter.exportConfig.channelKey = channelKey;
      inventoryExporter._resolveChannelKey = jest.fn(() => Promise.resolve());
      inventoryExporter._makeRequest = jest.fn(() => Promise.resolve());
      return inventoryExporter._fetchInventories().then(() => {
        expect(inventoryExporter._resolveChannelKey).toHaveBeenCalledTimes(1);
        expect(inventoryExporter._makeRequest).toHaveBeenCalledTimes(1);
        expect(inventoryExporter._resolveChannelKey.mock.calls[0][0]).toEqual(
          channelKey
        );
      });
    });

    it('should not resolve channel key if not present', () => {
      inventoryExporter._resolveChannelKey = jest.fn(() => Promise.resolve());
      inventoryExporter._makeRequest = jest.fn(() => Promise.resolve());
      return inventoryExporter._fetchInventories().then(() => {
        expect(inventoryExporter._resolveChannelKey).toHaveBeenCalledTimes(0);
        expect(inventoryExporter._makeRequest).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('::_makeRequest', () => {
    let processMock;
    beforeEach(() => {
      processMock = jest.fn((request, processFn) => {
        const sampleResult = {
          body: {
            results: [],
          },
        };
        return processFn(sampleResult).then(() => Promise.resolve());
      });
      jest.spyOn(InventoryExporter, '_writeEachInventory', jest.fn);
    });
    afterEach(() => {
      InventoryExporter._writeEachInventory.mockRestore();
    });
    it('should fetch inventories using the process method', () => {
      inventoryExporter.client.process = processMock;
      return inventoryExporter._makeRequest().then(() => {
        expect(processMock).toHaveBeenCalledTimes(1);
        expect(processMock.mock.calls[0][0]).toEqual(
          {
            // should expand customfields object and supplyChannel
            uri: '/foo/inventory?expand=custom.type&expand=supplyChannel',
            method: 'GET',
          },
          'first argument is request object'
        );
        expect(InventoryExporter._writeEachInventory).toHaveBeenCalledTimes(1);
      });
    });
    it('should add accessToken to request if present', () => {
      inventoryExporter.accessToken = '12345';
      inventoryExporter.client.process = processMock;
      return inventoryExporter._makeRequest().then(() => {
        expect(processMock).toHaveBeenCalledTimes(1);
        expect(processMock.mock.calls[0][0]).toEqual({
          uri: '/foo/inventory?expand=custom.type&expand=supplyChannel',
          method: 'GET',
          headers: {
            Authorization: 'Bearer 12345',
          },
        });
        expect(InventoryExporter._writeEachInventory).toHaveBeenCalledTimes(1);
      });
    });
    it('should add channelid and queryString to request if present', () => {
      inventoryExporter.accessToken = '12345';
      const channelId = '1234567qwertyuxcv';
      inventoryExporter.exportConfig.queryString = 'descript="lovely"';
      inventoryExporter.client.process = processMock;
      return inventoryExporter._makeRequest(null, channelId).then(() => {
        expect(processMock).toHaveBeenCalledTimes(1);
        expect(processMock.mock.calls[0][0]).toEqual({
          // eslint-disable-next-line max-len
          uri:
            '/foo/inventory?expand=custom.type&expand=supplyChannel&where=descript%3D%22lovely%22%20and%20supplyChannel(id%3D%221234567qwertyuxcv%22)',
          method: 'GET',
          headers: {
            Authorization: 'Bearer 12345',
          },
        });
        expect(InventoryExporter._writeEachInventory).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('::run', () => {
    beforeEach(() => {});
    it('should fetch inventories and output csv to stream', done => {
      inventoryExporter.exportConfig.format = 'csv';
      const sampleInventory = {
        sku: 'hello',
        quantityOnStock: 'me',
        restockableInDays: 4,
      };
      const spy = jest
        .spyOn(inventoryExporter, '_fetchInventories')
        .mockImplementation(csvStream => {
          csvStream.write(sampleInventory);
          return Promise.resolve();
        });
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = stripIndent`
          sku,quantityOnStock,restockableInDays
          hello,me,4
        `;
        expect(result).toEqual(expectedResult);
        spy.mockRestore();
        done();
      });

      inventoryExporter.run(outputStream);
    });

    it('should emit error if it occurs when streaming to csv', done => {
      inventoryExporter.exportConfig.format = 'csv';
      const spy = jest
        .spyOn(inventoryExporter, '_fetchInventories')
        .mockImplementation(() => Promise.reject(new Error('error occured')));
      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured');
        expect(result).toBeUndefined();
        spy.mockRestore();
        done();
      });

      inventoryExporter.run(outputStream);
    });

    it('should emit error if it occurs when streaming to json', done => {
      inventoryExporter.exportConfig.format = 'json';
      const spy = jest
        .spyOn(inventoryExporter, '_fetchInventories')
        .mockImplementation(() => Promise.reject(new Error('error occured')));
      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured');
        expect(result).toBeUndefined();
        spy.mockRestore();
        done();
      });

      inventoryExporter.run(outputStream);
    });

    it('should fetch inventories and output json as default', done => {
      const sampleInventory = {
        sku: 'hello',
        quantityOnStock: 'me',
        restockableInDays: 4,
      };
      const spy = jest
        .spyOn(inventoryExporter, '_fetchInventories')
        .mockImplementation(csvStream => {
          csvStream.write(sampleInventory);
          return Promise.resolve();
        });
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = [{ ...sampleInventory }];
        expect(JSON.parse(result)).toEqual(expectedResult);
        spy.mockRestore();
        done();
      });

      inventoryExporter.run(outputStream);
    });
  });
  describe('::_writeEachInventory', () => {
    it('should loop over inventories and write to stream', () => {
      const csvWriteMock = jest.fn();
      const csvStreamMock = {
        write: csvWriteMock,
      };
      InventoryExporter._writeEachInventory(csvStreamMock, [1, 2, 3, 4, 5]);
      expect(csvWriteMock).toHaveBeenCalledTimes(5);
    });
  });
  describe('::inventoryMappings', () => {
    it('should export basic inventory object', () => {
      const inventory = {
        sku: 'qwert',
        quantityOnStock: 30,
      };
      const expectedResult = { ...inventory };
      const result = InventoryExporter.inventoryMappings(inventory);
      expect(result).toEqual(expectedResult);
    });

    it('should add other fields if present', () => {
      const inventory = {
        sku: 'qwert',
        quantityOnStock: 30,
        supplyChannel: {
          obj: {
            key: 'abi',
          },
        },
        restockableInDays: 23,
        expectedDelivery: Date.now(),
      };
      const expectedResult = {
        ...inventory,
        supplyChannel: 'abi',
      };
      const result = InventoryExporter.inventoryMappings(inventory);
      expect(result).toEqual(expectedResult);
    });

    it('should add customFields if present', () => {
      const inventory = {
        sku: 'qwert',
        quantityOnStock: 30,
        supplyChannel: {
          obj: {
            key: 'abi',
          },
        },
        restockableInDays: 23,
        expectedDelivery: Date.now(),
        custom: {
          type: {
            obj: {
              key: 'my-type',
            },
          },
          fields: {
            nac: 'foo',
            weg: 'Bearer',
          },
        },
      };
      const expectedResult = {
        ...inventory,
        supplyChannel: 'abi',
        customType: 'my-type',
        'customField.nac': 'foo',
        'customField.weg': 'Bearer',
      };
      delete expectedResult.custom; // remove unused fields
      const result = InventoryExporter.inventoryMappings(inventory);
      expect(result).toEqual(expectedResult);
    });
  });
  describe('::resolveChannelKey', () => {
    it('should resolve channel key from the API and return id', () => {
      const channelKey = 'foobar';
      const expectedChannelId = '12345678sdfghj';
      const mockResult = {
        body: {
          results: [
            {
              id: expectedChannelId,
            },
          ],
        },
      };
      const executeMock = jest.fn(() => Promise.resolve(mockResult));
      inventoryExporter.client.execute = executeMock;
      return inventoryExporter._resolveChannelKey(channelKey).then(id => {
        expect(executeMock).toHaveBeenCalled();
        expect(id).toBe(expectedChannelId);
      });
    });

    it('should resolve channel key from the API using token', () => {
      const channelKey = 'foobar';
      const expectedChannelId = '12345678sdfghj';
      const mockResult = {
        body: {
          results: [
            {
              id: expectedChannelId,
            },
          ],
        },
      };
      const executeMock = jest.fn(() => Promise.resolve(mockResult));
      inventoryExporter.client.execute = executeMock;
      inventoryExporter.accessToken = '12345';
      return inventoryExporter._resolveChannelKey(channelKey).then(id => {
        expect(executeMock.mock.calls[0][0]).toEqual({
          uri: '/foo/channels?where=key%3D%22foobar%22',
          method: 'GET',
          headers: {
            Authorization: 'Bearer 12345',
          },
        });
        expect(executeMock).toHaveBeenCalled();
        expect(id).toBe(expectedChannelId);
      });
    });

    it('should reject if channel key is not found', () => {
      const channelKey = 'foobar';
      const mockResult = {
        body: {
          results: [],
        },
      };
      const executeMock = jest.fn(() => Promise.resolve(mockResult));
      inventoryExporter.client.execute = executeMock;
      return inventoryExporter._resolveChannelKey(channelKey).catch(err => {
        expect(err.message).toBe('No data with channel key in CTP Platform');
      });
    });
  });
});
