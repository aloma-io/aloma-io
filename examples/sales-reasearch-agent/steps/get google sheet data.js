/**
 * Step: get google sheet data
 * ID: bjulwbbpywm2lqzur3x3l2ddozqlizbo
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
getData: true
};

export const content = async () => {
const sheetId = task.config("GOOGLE_SHEET");
const response = await connectors.googleSheets.request({ 
  url: `/${encodeURIComponent(sheetId)}/values/${encodeURIComponent('Data')}`
});

const headers = response.values[1];
const alomaFilters = response.values[0];
const companies = [];
let reachedEnd = false;

for (let i = 2; i < response.values.length; i++) {
  if (data.getCompanyNews && companies.length >= alomaFilters[2]) break;
  const row = response.values[i];

  if (row.some(cell => cell?.toLowerCase() === "end")) {
    reachedEnd = true;
    break
  }

  const item = {};

  headers.forEach((key, index) => {
    item[key] = row[index] || "";
  });

  if (
    data.getCompanyNews &&
    item['Business Industry Type'] === alomaFilters[4] &&
    item['Business Development Phase'] === alomaFilters[3] &&
    item['Aloma processed'] !== 'yes'
  ) {
    item.rowIndex = i
    companies.push(item);
  } else if (
    data.getIndustryNews &&
    item['Business Industry Type'] === alomaFilters[4]
  ) {
    companies.push(item);
  };
}
if (reachedEnd && companies.length === 0) {
  console.log("No companies to process as none meet Aloma filters.")
  task.complete();
} else {
  data.companies = companies;
  data.industry = alomaFilters[4]
  data.index = 0;
  data.nextStep = 1
}

};
