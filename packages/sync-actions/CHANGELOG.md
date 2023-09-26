# @commercetools/sync-actions

## 5.15.0

### Minor Changes

- [#1885](https://github.com/commercetools/nodejs/pull/1885) [`d6cb2740`](https://github.com/commercetools/nodejs/commit/d6cb27401279cb42a49366f32802f8ca8c7f01a3) Thanks [@kafis](https://github.com/kafis)! - Add support for 'changeAssetOrder' in (ProductVariants)[https://docs.commercetools.com/api/projects/products#change-asset-order].

## 5.14.0

### Minor Changes

- [#1876](https://github.com/commercetools/nodejs/pull/1876) [`27f0d2b6`](https://github.com/commercetools/nodejs/commit/27f0d2b66fefbe082b6a27e7fa940b09e7e6088c) Thanks [@jaikumar-tj](https://github.com/jaikumar-tj)! - Add support for attribute groups `changeName`, `setKey`, `setDescription`, `addAttribute` and `removeAttribute` actions.

## 5.13.0

### Minor Changes

- [#1874](https://github.com/commercetools/nodejs/pull/1874) [`69f4501d`](https://github.com/commercetools/nodejs/commit/69f4501dc5401ab2b44f4d3096a978094e402c9f) Thanks [@taylor-knapp](https://github.com/taylor-knapp)! - Handle long text values performantly

## 5.12.2

### Patch Changes

- [#1871](https://github.com/commercetools/nodejs/pull/1871) [`4f8ea39b`](https://github.com/commercetools/nodejs/commit/4f8ea39b66ddd5014ac8f923ed980584bd96290c) Thanks [@ARRIOLALEO](https://github.com/ARRIOLALEO)! - rollback setPriceTiers name change

## 5.12.1

### Patch Changes

- [#1869](https://github.com/commercetools/nodejs/pull/1869) [`7285a9fb`](https://github.com/commercetools/nodejs/commit/7285a9fbcbcfca6a9460e36ba7b58bb30f34fac6) Thanks [@ARRIOLALEO](https://github.com/ARRIOLALEO)! - Add support for StandalonePrice `setPriceTier`

## 5.12.0

### Minor Changes

- [#1863](https://github.com/commercetools/nodejs/pull/1863) [`7ed7a663`](https://github.com/commercetools/nodejs/commit/7ed7a663c1cb3aa87bfb4b4c2c008949a66a62e0) Thanks [@ragafus](https://github.com/ragafus)! - Add support for StandalonePrice `setKey`, `setValidFrom`, `setValidUntil`, `setValidFromAndUntil` and `changeActive` actions.

## 5.11.0

### Minor Changes

- [#1864](https://github.com/commercetools/nodejs/pull/1864) [`91f6b617`](https://github.com/commercetools/nodejs/commit/91f6b61794e7d66766097965e452e14c85e40f14) Thanks [@ARRIOLALEO](https://github.com/ARRIOLALEO)! - Add support for StandalonePrice `setPriceTiers`

## 5.10.0

### Minor Changes

- [#1856](https://github.com/commercetools/nodejs/pull/1856) [`9a3e3711`](https://github.com/commercetools/nodejs/commit/9a3e3711bf6594deafb5d54a9ce9e32450f9c4d6) Thanks [@qmateub](https://github.com/qmateub)! - orders sync-actions: support action on delivery items `setDeliveryItems`

## 5.9.0

### Minor Changes

- [#1853](https://github.com/commercetools/nodejs/pull/1853) [`4bb8f979`](https://github.com/commercetools/nodejs/commit/4bb8f979c317bbce1654ca0f1abc9b4717fdda0b) Thanks [@markus-azer](https://github.com/markus-azer)! - types sync-actions: support the following actions `changeInputHint`, `changeEnumValueLabel`, `changeLocalizedEnumValueLabel`.

## 5.8.0

### Minor Changes

- [#1852](https://github.com/commercetools/nodejs/pull/1852) [`94a376c8`](https://github.com/commercetools/nodejs/commit/94a376c89525b7cee58b710154ddf7cb146cd16c) Thanks [@markus-azer](https://github.com/markus-azer)! - types sync-actions: fix action structure for changeFieldDefinitionOrder
  fix internal type sync error by adding optional chaining

## 5.7.0

### Minor Changes

- [#1850](https://github.com/commercetools/nodejs/pull/1850) [`330cd9a9`](https://github.com/commercetools/nodejs/commit/330cd9a9b4fca045d479d2d220d2a2a2b966b1f4) Thanks [@markus-azer](https://github.com/markus-azer)! - types sync-actions: fix action structure for changeLocalizedEnumValueOrder, changeEnumValueOrder

## 5.6.0

### Minor Changes

- [#1844](https://github.com/commercetools/nodejs/pull/1844) [`23f0529b`](https://github.com/commercetools/nodejs/commit/23f0529bbf359a11500dbf87bdc9e59cb759c89a) Thanks [@markus-azer](https://github.com/markus-azer)! - Add localizedName action to shipping methods

## 5.5.0

### Minor Changes

- [#1841](https://github.com/commercetools/nodejs/pull/1841) [`b90c7238`](https://github.com/commercetools/nodejs/commit/b90c7238f0d3d892e1066fd2883cff062b099e66) Thanks [@Rombelirk](https://github.com/Rombelirk)! - Add Custom Fields to Shipping Methods.

## 5.4.1

### Patch Changes

- [#1839](https://github.com/commercetools/nodejs/pull/1839) [`d6cadcbc`](https://github.com/commercetools/nodejs/commit/d6cadcbc4b850fa6f438b65c3b63b294a32a58ee) Thanks [@tdeekens](https://github.com/tdeekens)! - Fix failing to sync froozen arrays for prices

## 5.4.0

### Minor Changes

- [#1836](https://github.com/commercetools/nodejs/pull/1836) [`ad34d030`](https://github.com/commercetools/nodejs/commit/ad34d03041e7e6b8284da6224dc968fde537a85a) Thanks [@nicolasnieto92](https://github.com/nicolasnieto92)! - Add setAuthenticationMode sync action

## 5.3.1

### Patch Changes

- [#1818](https://github.com/commercetools/nodejs/pull/1818) [`856929e3`](https://github.com/commercetools/nodejs/commit/856929e3bc176021a9b52e1ff9c888e51c83cccd) Thanks [@qmateub](https://github.com/qmateub)! - fix(sync-actions/orders): adjust diff calculation of returnInfo items

## 5.3.0

### Minor Changes

- [#1820](https://github.com/commercetools/nodejs/pull/1820) [`c3964026`](https://github.com/commercetools/nodejs/commit/c3964026b401cb1c8ae8b581a3fcc4ea692ed3b4) Thanks [@danrleyt](https://github.com/danrleyt)! - Adding support to quote requests and staged quotes

## 5.2.0

### Minor Changes

- [`cad54c42`](https://github.com/commercetools/nodejs/commit/cad54c421e18464ae03fb283a30f2ba2f3f6e46a) Thanks [@qmateub](https://github.com/qmateub)! - feat(sync-actions): improve performance for large arrays comparisons"

## 5.1.0

### Minor Changes

- [#1803](https://github.com/commercetools/nodejs/pull/1803) [`823985ae`](https://github.com/commercetools/nodejs/commit/823985ae67465673c26f296b68681f255230d571) Thanks [@nicolasnieto92](https://github.com/nicolasnieto92)! - Add createSyncStandalonePrices export to index for supporting prices sync actions

## 5.0.0

### Major Changes

- [#1775](https://github.com/commercetools/nodejs/pull/1775) [`35669f30`](https://github.com/commercetools/nodejs/commit/35669f30dbc4b24d59ec3df3f38417b1f2a77837) Thanks [@ajimae](https://github.com/ajimae)! - Drop support for Node `v10` and `v12`. Supported versions now are `v14`, `v16` and `v18`.

## 4.13.0

### Minor Changes

- [#1798](https://github.com/commercetools/nodejs/pull/1798) [`850325d0`](https://github.com/commercetools/nodejs/commit/850325d08603764787c387b2341e4009d0c4f788) Thanks [@markus-azer](https://github.com/markus-azer)! - support standalone prices

## 4.12.0

### Minor Changes

- [#1796](https://github.com/commercetools/nodejs/pull/1796) [`7aaf91cd`](https://github.com/commercetools/nodejs/commit/7aaf91cdecb7c844943369fc137a5356becdba36) Thanks [@VineetKumarKushwaha](https://github.com/VineetKumarKushwaha)! - Fix custom types sync actions to detect addEnumValue action correctly

## 4.11.0

### Minor Changes

- [#1788](https://github.com/commercetools/nodejs/pull/1788) [`f1acfb67`](https://github.com/commercetools/nodejs/commit/f1acfb67708d8253f551481fd65097add48c6686) Thanks [@nicolasnieto92](https://github.com/nicolasnieto92)! - Add setPriceMode sync action for commercetools-importer project

## 4.10.1

### Patch Changes

- [#1770](https://github.com/commercetools/nodejs/pull/1770) [`381d1e1f`](https://github.com/commercetools/nodejs/commit/381d1e1f07cc2705962973e3a48934bf7884e309) Thanks [@mohib0306](https://github.com/mohib0306)! - Fix product selection's name update action. `setName` => `changeName`
  Expose `createSyncProductSelections` from `sync-actions` package

## 4.10.0

### Minor Changes

- [#1767](https://github.com/commercetools/nodejs/pull/1767) [`1aef3423`](https://github.com/commercetools/nodejs/commit/1aef3423e96da7f5df20fd5f66ec29146cacee83) Thanks [@mohib0306](https://github.com/mohib0306)! - feat(sync-actions/product-selections): add sync action support for product selections

  As product selections are available via the API, the sync-actions package is updated to support generating update actions for product selections.
