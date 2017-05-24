\# Discount Code Generator

Generate unique discount codes to be imported to the [commercetools platform](https://dev.commercetools.com/). See usage below

## Usage
`npm install @commercetools/discount-code-generator --global`

### CLI
```
Usage: discount-code-gen [options]

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
  --logLevel,                Logging level: error, warn, info or verbose.                [default: "info"]
```

#### Info on flags
- The `--quantity` flag represents the number of codes to be generated. It must be a number between 1 and 500000
- The `--code-length` flag is used to customise the discount codes according to individual use cases. (more info in [Examples](#examples))
- The `--input` flag specifies the path to a CSV or JSON file containing the options the discount codes should have. If this flag is omitted, discount codes without any attributes will be generated.
- The `--output` flag specifies where to output/save the generated codes. Several notes on this flag:
  - The format of the generated output will depend on the format of the file specified here. It must be CSV or JSON as these are the only supported formats.
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the generated codes will be logged to the standard output as a result, status reports will be logged to a `discountCodeGenerator.log` file
- The `--delimiter` flag specifies the delimiter used in the input file and/or output file if any or both are CSV. Defaults to `','` if omitted and will be ignored if neither input nor output is CSV
- The `--multivalueDelimiter` flag specifies the delimiter for multivalue cells in CSV. Note that only the `cartDiscounts` field if present should contain multiple values. Defaults to `';'` if omitted

### Examples
#### CSV
If we want to generate 3 discount codes, each having 9 characters(code-length), 'FOO' as prefix, and having the following data stored in a CSV file:
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
If we want to generate 3 discount codes, each having 9 characters(code-length), 'FOO' as prefix, and having the following data stored in a JSON file:
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
- The input option can be left out completely if no code attributes are required
