export default function() {
  return {
    'variant-sku': 'my-price',
    value: { currencyCode: 'EUR', centAmount: '4200' },
    country: 'DE',
    customerGroup: { groupName: 'customer-group' },
    channel: { key: 'my-channel' },
    validFrom: '2016-11-01T08:01:19+0000',
    validUntil: '2016-12-01T08:03:10+0000',
    customType: 'custom-type',
    customField: {
      numbertype: '12',
      stringtype: 'nac',
      booleantype: 'true',
      localizedstringtype: { nl: 'Selwyn', de: 'Merkel' },
      status: 'Ready',
      moneytype: 'EUR 1200',
      settype: '1,2,3,5',
    },
  };
}
