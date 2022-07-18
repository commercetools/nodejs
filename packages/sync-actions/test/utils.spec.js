import { getDeltaValue } from '../src/utils/diffpatcher'

describe('::utils', () => {
  test('should throw an error for non array parameter', () => {
    expect(() => getDeltaValue('non-array-imput', { sample: 'object' })).toThrow()
  });
  test('throw an error if `originalObject` is not provided', () => {
    const sampleArray = [
      {
        measurements: {
          heightInMillimeter: 10,
          lengthInMillimeter: 20,
          widthInMillimeter: 2,
          weightInGram: 5
        },
        trackingData: { trackingId: 'tracking-id-1' }
      },
      {
        measurements: {
          heightInMillimeter: 10,
          lengthInMillimeter: 20,
          widthInMillimeter: 2,
          weightInGram: 5
        },
        trackingData: { trackingId: 'tracking-id-2' }
      },
      2
    ]
    expect(() => getDeltaValue(sampleArray, null)).toThrow()
  });
  test('throw an error if array is length 3 and second item is 3', () => {
    const sampleArray = [
      {
        measurements: {
          heightInMillimeter: 10,
          lengthInMillimeter: 20,
          widthInMillimeter: 2,
          weightInGram: 5
        },
        trackingData: { trackingId: 'tracking-id-1' }
      },
      {
        measurements: {
          heightInMillimeter: 10,
          lengthInMillimeter: 20,
          widthInMillimeter: 2,
          weightInGram: 5
        },
        trackingData: { trackingId: 'tracking-id-2' }
      },
      3
    ]
    expect(() => getDeltaValue(sampleArray, null)).toThrow()
  });
  test('throw an error if array is length 3 and second item is 4', () => {
    const sampleArray = [
      {
        measurements: {
          heightInMillimeter: 10,
          lengthInMillimeter: 20,
          widthInMillimeter: 2,
          weightInGram: 5
        },
        trackingData: { trackingId: 'tracking-id-1' }
      },
      {
        measurements: {
          heightInMillimeter: 10,
          lengthInMillimeter: 20,
          widthInMillimeter: 2,
          weightInGram: 5
        },
        trackingData: { trackingId: 'tracking-id-2' }
      },
      4
    ]
    expect(() => getDeltaValue(sampleArray, null)).toThrow()
  });
});
