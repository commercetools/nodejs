import findMatchingPairs from '../../src/utils/find-matching-pairs'

describe('findMatchingPairs', () => {
  let diff
  let newVariants
  let oldVariants
  beforeEach(() => {
    diff = {
      variants: {
        0: {
          images: {
            _t: 'a',
            _1: [
              '',
              0,
              3,
            ],
          },
        },
        1: {
          key: [
            'test',
            0,
            0,
          ],
          prices: [
            [],
          ],
        },
        _t: 'a',
        _3: [
          '',
          0,
          3,
        ],
        _4: [
          {
            assets: [],
            images: [],
            prices: [],
            sku: 'vid6',
            id: 10,
          },
          0,
          0,
        ],
        _5: [
          '',
          1,
          3,
        ],
      },
    }
    oldVariants = [
      {
        assets: [],
        images: [],
        prices: [],
        sku: 'third-variant',
        id: 3,
      },
      {
        assets: [],
        images: [],
        prices: [],
        id: 4,
      },
      {
        assets: [],
        images: [],
        prices: [],
        sku: 'testing-animation',
        id: 5,
      },
      {
        assets: [],
        images: [
          {
            url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/Screen+Shot+2017-04--LOx1OrZZ.png',
            dimensions: {
              w: 1456,
              h: 1078,
            },
          },
          {
            url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/cactus-with-surfboar-BmOeVZEZ.jpg',
            label: 'cactus',
            dimensions: {
              w: 602,
              h: 600,
            },
          },
        ],
        sku: '89978FRU',
        id: 1,
      },
      {
        assets: [],
        images: [],
        prices: [],
        sku: 'vid6',
        id: 10,
      },
      {
        availability: {
          isOnStock: true,
          availableQuantity: 5678,
        },
        assets: [],
        images: [],
        key: 'test',
        sku: 'secondary-variant',
        id: 2,
      },
    ]
    newVariants = [
      {
        id: 1,
        sku: '89978FRU',
        images: [
          {
            // eslint-disable-next-line max-len
            url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/cactus-with-surfboar-BmOeVZEZ.jpg',
            label: 'cactus',
            dimensions: {
              w: 602,
              h: 600,
            },
          },
          {
            // eslint-disable-next-line max-len
            url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/Screen+Shot+2017-04--LOx1OrZZ.png',
            dimensions: {
              w: 1456,
              h: 1078,
            },
          },
        ],
        assets: [],
      },
      {
        id: 2,
        sku: 'secondary-variant',
        prices: [],
        images: [],
        assets: [],
        availability: {
          isOnStock: true,
          availableQuantity: 5678,
        },
      },
      {
        id: 3,
        sku: 'third-variant',
        prices: [],
        images: [],
        assets: [],
      },
      {
        id: 4,
        prices: [],
        images: [],
        assets: [],
      },
      {
        id: 5,
        sku: 'testing-animation',
        prices: [],
        images: [],
        assets: [],
      },
    ]
  })

  it('should find matching pairs', () => {
    const actualResult = findMatchingPairs(
      diff.variants,
      oldVariants,
      newVariants,
      'id',
    )
    const expectedResult = {
      0: ['3', '0'],
      1: ['5', '1'],
      _3: ['3', '0'],
      _4: ['4', undefined],
      _5: ['5', '1'],
    }
    expect(actualResult).toEqual(expectedResult)
  })
})
