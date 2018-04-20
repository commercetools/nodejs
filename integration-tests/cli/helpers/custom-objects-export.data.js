export const createdCustomObjects = [
  {
    container: 'Ludus',
    key: 'copperKey',
    value: {
      paymentMethod: 'Cash',
      paymentID: '1',
    },
  },
  {
    container: 'Frobozz',
    key: 'jadeKey',
    value: {
      paymentMethod: 'cc',
      paymentID: '2',
    },
  },
  {
    container: 'Syrinx',
    key: 'crystalKey',
    value: {
      paymentMethod: 'new',
      paymentID: '3',
    },
  },
]

export const expectedCustomObjects = [
  {
    id: expect.any(String),
    version: 1,
    container: 'Ludus',
    key: 'copperKey',
    value: {
      paymentMethod: 'Cash',
      paymentID: '1',
    },
  },
  {
    id: expect.any(String),
    version: 1,
    container: 'Frobozz',
    key: 'jadeKey',
    value: {
      paymentMethod: 'cc',
      paymentID: '2',
    },
  },
  {
    id: expect.any(String),
    version: 1,
    container: 'Syrinx',
    key: 'crystalKey',
    value: {
      paymentMethod: 'new',
      paymentID: '3',
    },
  },
]
