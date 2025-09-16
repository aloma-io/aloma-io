/**
 * Step: add to google sheet
 * ID: cdk9uwfib5wawitsxn0dq30v5czpjcpg
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
  "googleSheetStep": true
};

export const content = async () => {
const spreadsheetId = task.config("COMPANIES_SPREADSHEET")
const cell = (what) => ({ userEnteredValue: { stringValue: what } });
const companies = data.hubspotCompanies;
let sheetId;
if (data.testing) {
  sheetId = 0;
  //task.complete()
  data.addToHubspot = true
} else if (data.production) {
  sheetId = 1647749038;
  data.addToHubspot = true
}

for (const company of companies) {
  if (company?.validatedContacts.length === 0) {
    continue
  }
  // const companySearchData = company.companySearch?.map(searchItem => {
  //   return `Title: ${searchItem.title}\nLink: ${searchItem.link}\n${searchItem.date ? `Date: ${searchItem.date}\n` : ""}Snippet: ${searchItem.snippet}`;
  // }).join("\n\n") || "";

  const rowData = {
    values: [
      cell(company?.id),
      cell(company.properties?.name),
      cell(company.properties?.domain),
      cell(company.properties?.industry),
      cell(company.properties?.city),
      
      cell(company?.companyNews),
      cell(company?.industryNews),
      cell(''),
      cell(company?.subject),
      cell(company?.sentence),
      cell(company?.paragraph),
      cell(company?.email),
      cell(company?.challenges),
      cell(company.emailData?.["Campaign Name"]),
      cell(company.emailData?.Sequence)
    ]
  };

  const body = {
    requests: [
      {
        appendCells: {
          sheetId: sheetId, 
          rows: [rowData],
          fields: '*'
        }
      }
    ]
  };
  
  const result = connectors.googleSheets.request({
    url: `/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
    options: {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  })
}
};
