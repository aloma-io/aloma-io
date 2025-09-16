/**
 * Step: filter properties
 * ID: p7heh3n0d5elrzg98gigzwaw3afcm2kt
 * 
 * Edit the condition and content below.
 * The condition should be a valid JavaScript object (trailing commas are allowed).
 * The content should be JavaScript code that will be executed.
 * 
 * Example:
 * condition = {
 *   newStep: true,  // trailing commas are fine
 *   status: "active"
 * };
 * 
 * content = async () => {
 *   console.log('running step');
 *   data.newStep = true;
 * };
 */

export const condition = {
  hubspotCompanies: Array,
  filterProps: true
};

export const content = async () => {
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const filteredCompanies = data.hubspotCompanies.map(company => {
  const filteredProperties = Object.fromEntries(
    Object.entries(company.properties).filter(([_, value]) => value !== null && value !== "")
  );
  if (filteredProperties.uc_last_contact_date) {
    const [year, month, day] = filteredProperties.uc_last_contact_date.split('-');
    filteredProperties.month = monthNames[parseInt(month, 10) - 1];
    filteredProperties.year = year;
  } else {
    filteredProperties.ucDate = false
  }
  filteredProperties.name = filteredProperties.name.replace(/\b(LLP|INC|LTD|LIMITED|COMPANY)\b/gi, '').trim();
  if (filteredProperties.name && /^[A-Z\s]+$/.test(filteredProperties.name)) {
    filteredProperties.name = filteredProperties.name
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase())
      .trim();
  }
  if (!filteredProperties.industry) {
    filteredProperties.industry = filteredProperties.hs_industry_group
  }
  if (filteredProperties.industry) {
  filteredProperties.industry = filteredProperties.industry
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^(\w)/, char => char.toUpperCase());
  }
  return {
    id: company.id,
    properties: filteredProperties
  };
});
if (data.console) {
  console.log("Filtered Companies: ", filteredCompanies)
};

data.hubspotCompanies = filteredCompanies;
data.getContacts = true
};
