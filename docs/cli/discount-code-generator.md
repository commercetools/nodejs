# Discount Code Generator

[![Travis Build Status][travis-icon]][travis]
[![Codecov Coverage Status][codecov-icon]][codecov]
[![David Dependencies Status][david-icon]][david]
[![David devDependencies Status][david-dev-icon]][david-dev]

Generate unique discount codes to be imported to the [commercetools platform](https://dev.commercetools.com/). See usage below

## Usage
`npm install @commercetools/discount-code-generator --global`

### CLI
```
Usage: discountCodeGenerator [options]
Convert commercetools price CSV data to JSON.

Options:
  --help, -h                 Show help text.                                                     [boolean]
  --version, -v              Show version number.                                                [boolean]
  --quantity, -q             Quantity of discount codes to generate. (Between 1 and 500000)     [required]
  --code-length, -l          Length of the discount codes to generate.                       [default: 11]
  --code-prefix, -p          Prefix for each code. No prefix will be used if omitted.        [default: ""]
  --input, -i                Path to code options CSV or JSON file.
  --output, -o               Path to store generated output file.                      [default: "stdout"]
  --delimiter, -d            Used CSV delimiter for input and/or output file.               [default: ","]
  --multivalueDelimiter, -m  Used CSV delimiter in multivalue fields for input/output file. [default: ";"]
```

#### Info on flags
- The ```--quantity``` flag represents the number of codes to be generated. It must be a number between 1 and 500000
- The ```--code-length``` flag is used to customise the discount codes according to individual use cases. (more info in Exmples)
- The ```--input``` flag specifies the path to a CSV or JSON file containing the options the discount codes should have. If this flag is omitted, discount codes without any attributes will be generated.
- The ```--output``` flag specifies where to output the generated codes. Note that if this file already exists, it will be overwritten.
- The ```--delimiter``` flag specifies the delimiter used in the input file and/or output file if any or both are CSV. Defaults to ```','``` if omitted and will be ignored if neither input nor output is CSV
- The ```--multivalueDelimiter``` flag specifies the delimiter for arrays in CSV. Note that only the ```cartDiscounts``` field if present should be an array. Defaults to ```';'``` if omitted

### Examples
#### CSV
If we want to generate 3 discount codes, each having 9 digits, 'FOO' as prefix, and having the following data stored in a CSV file:
```csv
name.en,name.de,description.en,description.de,cartDiscounts,cartPredicate,isActive,maxApplications,maxApplicationsPerCustomer
Sammy,Valerian,greatest promo,super angebot,good;better;best,value more than 20,true,10,2
```
and also wanting a CSV output, we would run the following command
```bash
discount-code-generator -i /path-to-code-data/input.csv -o /path-to-write-data/output.csv -q 3 -l 9 -p FOO
```

The following would be written to the output file:
```csv
"name.en","name.de","description.en","description.de","cartDiscounts","cartPredicate","isActive","maxApplications","maxApplicationsPerCustomer","code"
"Sammy","Valerian","greatest promo","super angebot","good;better;best","value more than 20","true","10","2","FOObcXdOd"
"Sammy","Valerian","greatest promo","super angebot","good;better;best","value more than 20","true","10","2","FOOiNfQyy"
"Sammy","Valerian","greatest promo","super angebot","good;better;best","value more than 20","true","10","2","FOONtF2XL"
```

#### JSON
If we want to generate 3 discount codes, each having 9 digits, of 'Foo' as prefix, and having the following data stored in a JSON file:
```js
{
  "name": {
   "en": "Sammy",
   "de": "Valerian"
  },
  "description": {
   "en": "greatest promo",
   "de": "super angebot"
  },
  "cartDiscounts": [
   "good",
   "better",
   "best"
  ],
  "cartPredicate": "value more than 20",
  "isActive": "true",
  "maxApplications": "10",
  "maxApplicationsPerCustomer": "2"
}
```
and also wanting a JSON output, we would run the following command
```bash
discount-code-generator -i /path-to-code-data/input.json -o /path-to-write-data/output.json -q 3 -l 9 -p FOO
```

The following would be written to the output file:
```js
[
 {
  "name": {
   "en": "Sammy",
   "de": "Valerian"
  },
  "description": {
   "en": "greatest promo",
   "de": "super angebot"
  },
  "cartDiscounts": [
   "good",
   "better",
   "best"
  ],
  "cartPredicate": "value more than 20",
  "isActive": "true",
  "maxApplications": "10",
  "maxApplicationsPerCustomer": "2",
  "code": "FOOnxqrck"
 },
 {
  "name": {
   "en": "Sammy",
   "de": "Valerian"
  },
  "description": {
   "en": "greatest promo",
   "de": "super angebot"
  },
  "cartDiscounts": [
   "good",
   "better",
   "best"
  ],
  "cartPredicate": "value more than 20",
  "isActive": "true",
  "maxApplications": "10",
  "maxApplicationsPerCustomer": "2",
  "code": "FOOlFeNRb"
 },
 {
  "name": {
   "en": "Sammy",
   "de": "Valerian"
  },
  "description": {
   "en": "greatest promo",
   "de": "super angebot"
  },
  "cartDiscounts": [
   "good",
   "better",
   "best"
  ],
  "cartPredicate": "value more than 20",
  "isActive": "true",
  "maxApplications": "10",
  "maxApplicationsPerCustomer": "2",
  "code": "FOO8LoJD3"
 }
]
```

##### Additional Info
- The JSON output option outputs an array of json objects
- The input and output formats are interchangeable; that means JSON output can be requested with a CSV input and vice versa
- All fields in the input are optional. However, the file must not be empty.
- The input option can be left completely if no code attributes are required


[commercetools]: https://commercetools.com/
[commercetools-icon]: https://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20horizontal%20RGB%2072dpi.png
[travis]: https://travis-ci.org/commercetools/discount-code-generator
[travis-icon]: https://img.shields.io/travis/commercetools/discount-code-generator/master.svg?style=flat-square
[codecov]: https://codecov.io/gh/commercetools/discount-code-generator
[codecov-icon]: https://img.shields.io/codecov/c/github/commercetools/discount-code-generator.svg?style=flat-square
[david]: https://david-dm.org/commercetools/discount-code-generator
[david-icon]: https://img.shields.io/david/commercetools/discount-code-generator.svg?style=flat-square
[david-dev]: https://david-dm.org/commercetools/discount-code-generator?type=dev
[david-dev-icon]: https://img.shields.io/david/dev/commercetools/discount-code-generator.svg?style=flat-square
