# @commercetools/sync-actions

## 7.2.0

### Minor Changes

- [#1909](https://github.com/commercetools/nodejs/pull/1909) [`6740404`](https://github.com/commercetools/nodejs/commit/6740404987a0cd6b979105febb1965ac10a18d01) Thanks [@phofmann](https://github.com/phofmann)! - Added support for extensions, business-units and subscriptions

## 7.1.3

### Patch Changes

- [`50bb5fd`](https://github.com/commercetools/nodejs/commit/50bb5fdc39f8341b54548aadd8835d37375b6ab1) Thanks [@tdeekens](https://github.com/tdeekens)! - Downgrade jsondiffpatch to v0.5.0 before becoming ESM only

## 7.1.2

### Patch Changes

- [#1962](https://github.com/commercetools/nodejs/pull/1962) [`b41c274`](https://github.com/commercetools/nodejs/commit/b41c274bfb0f86fcf7ff6172cab385db2f9e8769) Thanks [@tdeekens](https://github.com/tdeekens)! - Downgrade jsondiffpatch to 0.6.0

## 7.1.1

### Patch Changes

- [#1960](https://github.com/commercetools/nodejs/pull/1960) [`c19a0d5`](https://github.com/commercetools/nodejs/commit/c19a0d5f6b6fd90b8b6042b0feb0d960c9d46b26) Thanks [@tdeekens](https://github.com/tdeekens)! - Downgrade jsondiffpatch to fix ESM bundling issue.

## 7.1.0

### Minor Changes

- [#1934](https://github.com/commercetools/nodejs/pull/1934) [`0d20ce7`](https://github.com/commercetools/nodejs/commit/0d20ce78f58b012106e1005249a7eaeae4faef40) Thanks [@NickDevG](https://github.com/NickDevG)! - Adding business unit search status coverage

### Patch Changes

- [#1735](https://github.com/commercetools/nodejs/pull/1735) [`4879752`](https://github.com/commercetools/nodejs/commit/487975227ced4809e8ce30d9ae5cbd402c275672) Thanks [@renovate](https://github.com/apps/renovate)! - Update all dependencies

- [#1741](https://github.com/commercetools/nodejs/pull/1741) [`dd64902`](https://github.com/commercetools/nodejs/commit/dd6490249727ee462c238b35b1e38ec89464a1d0) Thanks [@renovate](https://github.com/apps/renovate)! - Remove resolutions from dependencies.

- [#1948](https://github.com/commercetools/nodejs/pull/1948) [`586ce1d`](https://github.com/commercetools/nodejs/commit/586ce1d212b5d69c023e1f4e31beaee6bda9f0cd) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- [#1957](https://github.com/commercetools/nodejs/pull/1957) [`acdf899`](https://github.com/commercetools/nodejs/commit/acdf8992103d8210d459bb247a3f6927339ef0bc) Thanks [@YahiaElTai](https://github.com/YahiaElTai)! - added recurring orders sync actions

- [#1949](https://github.com/commercetools/nodejs/pull/1949) [`6fe114e`](https://github.com/commercetools/nodejs/commit/6fe114e9a15edd319819cf98c33a4de22a6de301) Thanks [@industrian](https://github.com/industrian)! - Update links to documentation.

- [#1952](https://github.com/commercetools/nodejs/pull/1952) [`8ce2297`](https://github.com/commercetools/nodejs/commit/8ce2297ef43434ae4033efbf142d92401d81cd05) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 7.0.0

### Major Changes

- [#1930](https://github.com/commercetools/nodejs/pull/1930) [`5a56792`](https://github.com/commercetools/nodejs/commit/5a5679256a4a7e4b90bc47b945b12acb4f70b411) Thanks [@tdeekens](https://github.com/tdeekens)! - # Requires Node.js v18 or later

  This releases migrates packages to require Node.js v18 or later. Ideally you should be already using Node.js v20 or later. According to [Node.js Releases](https://nodejs.org/en/about/previous-releases) Node.js v18 will be in maintenance and reach End of Life by the end of April.

  Other than requiring Node.js v18 packages with this releases do not contain any internal breaking changes.

## 6.1.1

### Patch Changes

- [#1927](https://github.com/commercetools/nodejs/pull/1927) [`a4705c19`](https://github.com/commercetools/nodejs/commit/a4705c19af234cccde74cb52bfff912bf380c6ba) Thanks [@CarlosCortizasCT](https://github.com/CarlosCortizasCT)! - We found an issue in the way the `jsondiffpatch` was used that made this package not usable in a browser environment.

  In this version we adjust the way that package is imported and we pin a transitive dependency (`chalk`) to fix the error.

## 6.1.0

### Minor Changes

- [#1921](https://github.com/commercetools/nodejs/pull/1921) [`c9d23e86`](https://github.com/commercetools/nodejs/commit/c9d23e86a6013aafb6a3c296121e1c5995d9eab6) Thanks [@kafis](https://github.com/kafis)! - Introducing configuration to control the behaviour regarding generation of UpdateActions in respect to unsetting fields

## 6.0.0

### Major Changes

- [#1919](https://github.com/commercetools/nodejs/pull/1919) [`1c867e02`](https://github.com/commercetools/nodejs/commit/1c867e02285f5030d5ef7aebef46ea27e5e8521b) Thanks [@CarlosCortizasCT](https://github.com/CarlosCortizasCT)! - Update the way we import the `jsondiffpath` dependency to use `import` instead of `require`.

## 5.19.2

### Patch Changes

- [#1914](https://github.com/commercetools/nodejs/pull/1914) [`6e1195ed`](https://github.com/commercetools/nodejs/commit/6e1195ed05cc3338eac94e47f439f10b7b0e6e75) Thanks [@antoniolodias](https://github.com/antoniolodias)! - fix: filter out unchanged taxrates from changed list

## 5.19.1

### Patch Changes

- [#1912](https://github.com/commercetools/nodejs/pull/1912) [`06866537`](https://github.com/commercetools/nodejs/commit/06866537feb04eaf26521d43b654cbc2920bab0d) Thanks [@markus-azer](https://github.com/markus-azer)! - Fix product action groups category order hints

## 5.19.0

### Minor Changes

- [#1908](https://github.com/commercetools/nodejs/pull/1908) [`df373a1a`](https://github.com/commercetools/nodejs/commit/df373a1adbcaa2340b0af0656fd0dbab055329f8) Thanks [@ChristianMoll](https://github.com/ChristianMoll)! - Fix action keys for changeMyBusinessUnitStatusOnCreation, setMyBusinessUnitAssociateRoleOnCreation and changeCustomerSearchStatus

## 5.18.0

### Minor Changes

- [#1903](https://github.com/commercetools/nodejs/pull/1903) [`164f1ce7`](https://github.com/commercetools/nodejs/commit/164f1ce7526bb15a16f531572518cbb6ddd61098) Thanks [@ChristianMoll](https://github.com/ChristianMoll)! - Add sync actions changeMyBusinessUnitStatusOnCreation, setMyBusinessUnitAssociateRoleOnCreation and changeCustomerSearchStatus

## 5.17.0

### Minor Changes

- [#1897](https://github.com/commercetools/nodejs/pull/1897) [`940dd70b`](https://github.com/commercetools/nodejs/commit/940dd70ba53c51e0fb74849aadb688db6add764d) Thanks [@antoniolodias](https://github.com/antoniolodias)! - add changeActive to shipping methods base actions

## 5.16.0

### Minor Changes

- [#1892](https://github.com/commercetools/nodejs/pull/1892) [`fb03b746`](https://github.com/commercetools/nodejs/commit/fb03b7463a990934d2b11fd17b784af104431cc4) Thanks [@ragafus](https://github.com/ragafus)! - Add support for DiscountCodes `setKey` action.

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
