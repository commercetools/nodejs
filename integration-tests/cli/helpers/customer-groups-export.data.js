export default [
  {
    groupName: 'Ludus',
    key: 'copperKey',
    custom: {
      name: 'description',
      type: { name: 'String' },
      required: true,
      label: { en: 'size' },
      inputHint: 'SingleLine',
    },
  },
  {
    groupName: 'Frobozz',
    custom: {
      name: 'description',
      type: { name: 'String' },
      required: true,
      label: { en: 'weight' },
      inputHint: 'SingleLine',
    },
  },
  {
    groupName: 'Syrinx',
    key: 'crystalKey',
    custom: {
      name: 'description',
      type: { name: 'String' },
      required: false,
      label: { en: 'color' },
      inputHint: 'SingleLine',
    },
  },
]
