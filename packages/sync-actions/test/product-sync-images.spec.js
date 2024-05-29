import productsSyncFn from '../src/products'

/* eslint-disable max-len */
describe('Actions', () => {
  let productsSync
  beforeEach(() => {
    productsSync = productsSyncFn()
  })

  describe('with matching variant order', () => {
    test('should build actions for images', () => {
      const before = {
        id: '123',
        masterVariant: {
          id: 1,
          images: [],
        },
        variants: [
          {
            id: 2,
            images: [
              {
                url: '//example.com/image2.png',
                label: 'foo',
                dimensions: { h: 1024, w: 768 },
              },
            ],
          },
          {
            id: 3,
            images: [
              {
                url: '//example.com/image3.png',
                label: 'foo',
                dimensions: { h: 1024, w: 768 },
              },
              {
                url: '//example.com/image4.png',
                dimensions: { h: 1024, w: 768 },
              },
              {
                url: '//example.com/image5.png',
                label: 'foo',
                dimensions: { h: 1024, w: 768 },
              },
            ],
          },
          {
            id: 4,
            images: [
              // Order is important!
              {
                url: '//example.com/old-remove.png',
                dimensions: { h: 400, w: 600 },
              },
              {
                url: '//example.com/old-keep.png',
                dimensions: { h: 608, w: 1000 },
              },
            ],
          },
        ],
      }

      const now = {
        id: '123',
        masterVariant: {
          id: 1,
          images: [
            // new image
            { url: 'http://cat.com', label: 'A cat' },
          ],
        },
        variants: [
          {
            id: 2,
            images: [
              // no changes
              {
                url: '//example.com/image2.png',
                label: 'foo',
                dimensions: { h: 1024, w: 768 },
              },
            ],
          },
          {
            id: 3,
            images: [
              // label added
              {
                url: '//example.com/image4.png',
                label: 'ADDED',
                dimensions: { h: 400, w: 300 },
              },
              // label changed
              {
                url: '//example.com/image3.png',
                label: 'CHANGED',
                dimensions: { h: 1024, w: 768 },
              },
              // url changed (new image)
              {
                url: '//example.com/CHANGED.jpg',
                label: 'foo',
                dimensions: { h: 400, w: 300 },
              },
            ],
          },
          // images removed
          {
            id: 4,
            images: [
              {
                url: '//example.com/old-keep.png',
                dimensions: { h: 608, w: 1000 },
              },
            ],
          },
        ],
      }

      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'addExternalImage',
          variantId: 1,
          image: { url: 'http://cat.com', label: 'A cat' },
        },
        {
          action: 'setImageLabel',
          variantId: 3,
          imageUrl: '//example.com/image4.png',
          label: 'ADDED',
        },
        {
          action: 'setImageLabel',
          variantId: 3,
          imageUrl: '//example.com/image3.png',
          label: 'CHANGED',
        },
        {
          action: 'addExternalImage',
          variantId: 3,
          image: {
            url: '//example.com/CHANGED.jpg',
            label: 'foo',
            dimensions: { h: 400, w: 300 },
          },
        },
        {
          action: 'moveImageToPosition',
          variantId: 3,
          imageUrl: '//example.com/image4.png',
          position: 0,
        },
        {
          action: 'removeImage',
          variantId: 3,
          imageUrl: '//example.com/image5.png',
        },
        {
          action: 'removeImage',
          variantId: 4,
          imageUrl: '//example.com/old-remove.png',
        },
      ])
    })
  })

  describe('with non-matching variant order', () => {
    test('should detect image movement', () => {
      const before = {
        key: 'foo-key',
        published: true,
        hasStagedChanges: true,
        masterVariant: {
          assets: [],
          images: [],
          prices: [],
          sku: 'third-variant',
          id: 3,
        },
        variants: [
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
        ],
      }

      const now = {
        masterVariant: {
          id: 1,
          sku: '89978FRU',
          images: [
            {
              url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/cactus-with-surfboar-BmOeVZEZ.jpg',
              label: 'cactus',
              dimensions: {
                w: 602,
                h: 600,
              },
            },
            {
              url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/Screen+Shot+2017-04--LOx1OrZZ.png',
              dimensions: {
                w: 1456,
                h: 1078,
              },
            },
          ],
          assets: [],
        },
        variants: [
          {
            id: 2,
            sku: 'secondary-variant',
            key: 'test',
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
        ],
        hasStagedChanges: true,
        published: true,
        key: 'foo-key',
      }
      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changeMasterVariant',
          variantId: 1,
        },
        {
          action: 'removeVariant',
          id: 10,
        },
        {
          action: 'moveImageToPosition',
          variantId: 1,
          imageUrl:
            'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/cactus-with-surfboar-BmOeVZEZ.jpg',
          position: 0,
        },
      ])
    })

    test('should build actions for image removal', () => {
      const before = {
        key: 'foo-key',
        published: true,
        hasStagedChanges: true,
        masterVariant: {
          assets: [],
          images: [],
          prices: [],
          sku: 'third-variant',
          id: 3,
        },
        variants: [
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
            prices: [],
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
            prices: [],
            images: [],
            key: 'test',
            sku: 'secondary-variant',
            id: 2,
          },
        ],
      }

      const now = {
        masterVariant: {
          id: 1,
          sku: '89978FRU',
          prices: [],
          images: [
            {
              url: 'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/cactus-with-surfboar-BmOeVZEZ.jpg',
              label: 'cactus',
              dimensions: {
                w: 602,
                h: 600,
              },
            },
          ],
          assets: [],
        },
        variants: [
          {
            id: 2,
            sku: 'secondary-variant',
            key: 'test',
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
        ],
        hasStagedChanges: true,
        published: true,
        key: 'foo-key',
      }

      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changeMasterVariant',
          variantId: 1,
        },
        {
          action: 'removeVariant',
          id: 10,
        },
        {
          action: 'removeImage',
          imageUrl:
            'https://95bc80c3c245100a18cc-04fc5bec7ec901344d7cbd57f9a2fab3.ssl.cf3.rackcdn.com/Screen+Shot+2017-04--LOx1OrZZ.png',
          variantId: 1,
        },
      ])
    })
  })

  describe('without images', () => {
    test('should not build actions if images are not set', () => {
      const before = {
        id: '123-abc',
        masterVariant: { id: 1, images: [] },
        variants: [],
      }
      const now = {
        id: '456-def',
        masterVariant: { id: 1 },
        variants: [],
      }

      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([])
    })
  })
})
