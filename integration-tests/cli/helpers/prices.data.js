export const sampleProductType = {
  name: 'productTypeForPriceExport',
  description: 'bla bla bla',
  key: 'productTypeKey',
};

export const sampleCustomerGroup = {
  key: 'customer-group-key',
  groupName: 'customerGroupName',
};

export const sampleChannel = {
  key: 'my-channel-key',
};

export const sampleCustomType = {
  key: 'my-custom-type-key',
  name: {
    en: 'cedric diggory',
  },
  resourceTypeIds: ['product-price'],
  fieldDefinitions: [
    {
      name: 'loremIpsum',
      label: {
        en: 'my lorem ipsum custom type field',
      },
      required: false,
      type: {
        name: 'String',
      },
      inputHint: 'SingleLine',
    },
  ],
};

export const createProducts = (
  productType,
  customerGroup,
  channel,
  customType
) => [
  {
    name: {
      en: 'my-sample-product-1',
    },
    slug: {
      en: 'my-sample-product-sluggy-slug',
    },
    productType,
    masterVariant: {
      sku: 'master-variant-sku-1',
      prices: [
        {
          value: {
            centAmount: 2500,
            currencyCode: 'EUR',
          },
          country: 'IT',
          validFrom: '2017-11-01T08:01:19+0000',
          validUntil: '2019-11-01T08:01:21+0000',
          customerGroup,
          channel,
          custom: {
            type: customType,
            fields: {
              loremIpsum: 'custom-field-definition-1',
            },
          },
        },
      ],
    },
    variants: [
      {
        sku: 'variant-sku-1',
        prices: [
          {
            value: {
              centAmount: 2500,
              currencyCode: 'USD',
            },
            country: 'US',
            validFrom: '2017-11-01T08:01:19+0000',
            validUntil: '2019-11-01T08:01:21+0000',
            customerGroup,
            channel,
            custom: {
              type: customType,
              fields: {
                loremIpsum: 'custom-field-definition-2',
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: {
      en: 'my-sample-product-2',
    },
    slug: {
      en: 'my-second-sample-product-sluggy-slugger',
    },
    productType,
    masterVariant: {
      sku: 'master-variant-sku-2',
      prices: [
        {
          value: {
            centAmount: 2500,
            currencyCode: 'EUR',
          },
          country: 'GB',
          validFrom: '2017-11-01T08:01:19+0000',
          validUntil: '2019-11-01T08:01:21+0000',
          customerGroup,
          channel,
          custom: {
            type: customType,
            fields: {
              loremIpsum: 'custom-field-definition-2',
            },
          },
        },
      ],
    },
    variants: [
      {
        sku: 'variant-sku-2',
        prices: [
          {
            value: {
              centAmount: 2500,
              currencyCode: 'GBP',
            },
            country: 'GB',
            validFrom: '2017-11-01T08:01:19+0000',
            validUntil: '2019-11-01T08:01:21+0000',
            customerGroup,
            channel,
            custom: {
              type: customType,
              fields: {
                loremIpsum: 'custom-field-definition-2',
              },
            },
          },
        ],
      },
    ],
  },
];
