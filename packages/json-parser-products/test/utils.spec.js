import slugify from '../src/utils'

describe('::slugify', () => {
  it('should slugify a string', () => {
    const sample = 'THis is$% a -- Sample TexT --- '
    const expected = 'this-is-a-sample-text'

    const actual = slugify(sample)
    expect(actual).toBe(expected)
  })
})
