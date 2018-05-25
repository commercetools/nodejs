export const customer = [
  {
    email: 'foo@bar.de',
    password: 'foobar',
    key: 'myKey',
  },
]

export const shoppingList = [
  {
    name: {
      de: 'deutscherListenName',
      en: 'englishListName',
    },
  },
]

export const review = [
  {
    text: 'Review text',
  },
]

export const payment = [
  {
    amountPlanned: {
      currencyCode: 'EUR',
      centAmount: 100,
    },
  },
]

export const order = [
  {
    version: 3,
  },
]

export const cart = [
  {
    currency: 'EUR',
    shippingAddress: {
      country: 'DE',
    },
  },
]

export const customLineItem = [
  {
    version: 1,
    actions: [
      {
        action: 'addCustomLineItem',
        name: {
          en: 'Name EN',
          de: 'Name DE',
        },
        quantity: 1,
        money: {
          currencyCode: 'EUR',
          centAmount: 4200,
        },
        slug: 'mySlug',
        taxCategory: {
          typeId: 'tax-category',
          id: 'fd890829-7554-4c22-a806-d6c6dcdbb0c5',
        },
      },
    ],
  },
]
