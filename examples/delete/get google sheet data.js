/**
 * Step: get google sheet data
 * ID: fhm2a379j0442z2y8zihpcp5y41yfsn0
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
  hubspotCompanies: [{
      industryNews: String
  }],
  production: true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  const sheetId = '18R4zrQZ9GIPEh4JrGs_TEMijHnJmCmGsCbd5lmS7cws';
  const response2 = await connectors.googleSheets.request({
    url: `/${encodeURIComponent(sheetId)}/values/Campaigns`,
  });

  const rows = response2.values;
  const headers = rows[0];
  const dataRows = rows.slice(1);

  const filteredRowsWithIndex = dataRows
    .map((row, index) => ({
      rowNumber: index + 2,
      rowData: row
    }))
    .filter(item => item.rowData[0] === 'Y');

//  console.log(filteredRowsWithIndex);

  const randomIndex = Math.floor(Math.random() * filteredRowsWithIndex.length);
//  console.log(randomIndex);
  const dataRow = filteredRowsWithIndex[randomIndex];
  const result = {};
  headers.forEach((header, i) => {
    result[header] = dataRow.rowData[i] || null;
  });

  const aiGenPrompt = result?.["AI gen prompt"]
  const claudePrompt = result?.["Claude prompt"]
  const systemPrompt = result?.["System Prompt"]

  const response = await connectors.googleSheets.request({
    url: `/${encodeURIComponent(sheetId)}/values/Prompts`,
  });
  const rows2 = response.values
  const openAIRow = rows2[Number(aiGenPrompt)]
  const claudeRow = rows2[Number(claudePrompt)]
  const systemRow = rows2[Number(systemPrompt)]
  result.openAIPrompt = openAIRow[2]
  result.claudePrompt = claudeRow[2]
  result.systemPrompt = systemRow[2]
//  console.log(result);
  company.emailData = result
}
};
