function _parseBool(value) {
  return value === 'true' || value === true;
}

// Implement a function to correctly cast boolean and number types in the CSV
// This is necessary because the csv-parser parses all fields as strings
export default function castTypes(item) {
  const casted = item;
  if (item.isActive) casted.isActive = _parseBool(item.isActive);
  if (item.maxApplications)
    casted.maxApplications = parseInt(item.maxApplications, 10);
  if (item.maxApplicationsPerCustomer)
    casted.maxApplicationsPerCustomer = parseInt(
      item.maxApplicationsPerCustomer,
      10
    );
  return casted;
}
