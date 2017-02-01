#!/usr/bin/env bash

read -p "Package name: " name

nameCell="[\`$name\`](/packages/$name)"
versionCell="[![$name Version][$name-icon]][$name-version]"
dependenciesCell="[![$name Dependencies Status][$name-dependencies-icon]][$name-dependencies]"

echo "| $nameCell | $versionCell | $dependenciesCell |"

versionUrl="[$name-version]: https://www.npmjs.com/package/@commercetools/$name"
versionIcon="[$name-icon]: https://img.shields.io/npm/v/@commercetools/$name.svg?style=flat-square"
dependenciesUrl="[$name-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/$name"
dependenciesIcon="[$name-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/$name&style=flat-square"

echo "
$versionUrl
$versionIcon
$dependenciesUrl
$dependenciesIcon
"
