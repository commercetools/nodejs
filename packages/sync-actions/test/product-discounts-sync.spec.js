import productDiscountsSyncFn, { actionGroups } from '../src/product-discounts';
import { baseActionsList } from '../src/product-discounts-actions';

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base']);
  });

  it('correctly defined base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeIsActive', key: 'isActive' },
      { action: 'changeName', key: 'name' },
      { action: 'changePredicate', key: 'predicate' },
      { action: 'changeSortOrder', key: 'sortOrder' },
      { action: 'changeValue', key: 'value' },
      { action: 'setDescription', key: 'description' },
    ]);
  });
});

describe('Actions', () => {
  let productDiscountsSync;
  beforeEach(() => {
    productDiscountsSync = productDiscountsSyncFn();
  });

  it('should build "changeName" action', () => {
    const before = {
      name: { en: 'en-name-before', de: 'de-name-before' },
    };

    const now = {
      name: { en: 'en-name-now', de: 'de-name-now' },
    };

    const expected = [
      {
        action: 'changeName',
        name: { en: 'en-name-now', de: 'de-name-now' },
      },
    ];
    const actual = productDiscountsSync.buildActions(now, before);
    expect(actual).toEqual(expected);
  });
});
