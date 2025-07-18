/**
 * Step: add to google sheet
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
companies: [{
    message: String
    }]
};

export const content = async () => {
const spreadsheetId = task.config("GOOGLE_SHEET");

const emailsSheetName = "Emails";
const dataSheetName = "DATA";

const clientColumnEmails = "A";
const subjectColumn = "B";
const messageColumn = "C";

const clientColumnData = "B";
const alomaProcessedColumn = "F";

const emailsResponse = await connectors.googleSheets.request({
  url: `/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(emailsSheetName)}!A:Z`
});

const emailsSheetData = emailsResponse.values;
const emailsHeaders = emailsSheetData[1];

const dataResponse = await connectors.googleSheets.request({
  url: `/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(dataSheetName)}!A:Z`
});

const dataSheetData = dataResponse.values;
const dataHeaders = dataSheetData[1];

const clientNameIndexData = dataHeaders.indexOf("Client name");
const alomaProcessedIndex = dataHeaders.indexOf("Aloma processed");

if (clientNameIndexData === -1 || alomaProcessedIndex === -1) {
  throw new Error("Client name or Aloma processed column not found in the Data sheet!");
}

for (const company of data.companies) {
  const clientName = company?.["Client name"];

  const rowIndexData = company?.rowIndex

  if (rowIndexData !== -1) {
    const rowNumberData = rowIndexData + 1;

    const rowDataEmails = {
      range: `${emailsSheetName}!${subjectColumn}${rowNumberData}:${messageColumn}${rowNumberData}`,
      majorDimension: "ROWS",
      values: [[company?.subject || "", company?.message || ""]]
    };

    await connectors.googleSheets.request({
      url: `/${encodeURIComponent(spreadsheetId)}/values/${emailsSheetName}!${subjectColumn}${rowNumberData}:${messageColumn}${rowNumberData}?valueInputOption=RAW`,
      options: {
        method: 'PUT',
        body: JSON.stringify(rowDataEmails),
        headers: { 'Content-Type': 'application/json' }
      }
    });

    const rowDataData = {
      range: `${dataSheetName}!${alomaProcessedColumn}${rowNumberData}`,
      majorDimension: "ROWS",
      values: [["yes"]]
    };

    await connectors.googleSheets.request({
      url: `/${encodeURIComponent(spreadsheetId)}/values/${dataSheetName}!${alomaProcessedColumn}${rowNumberData}?valueInputOption=RAW`,
      options: {
        method: 'PUT',
        body: JSON.stringify(rowDataData),
        headers: { 'Content-Type': 'application/json' }
      }
    });
  } else {
    console.warn(`Client name '${clientName}' not found in Data sheet. Skipping.`);
  }
}

data.generatePDF = true;

};
