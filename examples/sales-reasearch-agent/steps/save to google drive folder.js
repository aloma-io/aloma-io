/**
 * Step: save to google drive folder
 * ID: xpjje5njvha9v80hhgmnpx7xt5iif9h0
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
pdfCreated: true
}
;

export const content = async () => {
const folderID = task.config("GOOGLE_DRIVE_FOLDER");
const spreadsheetId = task.config("GOOGLE_SHEET");
const emailsSheetName = "Emails";
const dataSheetName = "DATA";
const profileColumn = "D";

if (data.getCompanyNews) {

  for (const company of data.companies) {
    const companyName = company?.["Client name"];

    const rowIndexData = company?.rowIndex

    if (rowIndexData !== -1) {
      const rowNumberData = rowIndexData + 1;

      const pdf = blob.getContent(company.pdf);
      const obj = JSON.parse(pdf);
      const pdfBase64 = lib.base64.encode(obj);

      const upload = connectors.googleDrive.uploadFile({
        name: `Company_News_For_${companyName}`,
        content: pdfBase64,
        mimetype: "application/pdf",
        parentId: folderID
      });

      const fileLink = `https://drive.google.com/file/d/${upload}/view?usp=sharing`;

      const rowDataEmails = {
        range: `${emailsSheetName}!${profileColumn}${rowNumberData}`,
        majorDimension: "ROWS",
        values: [[fileLink]]
      };

      await connectors.googleSheets.request({
        url: `/${encodeURIComponent(spreadsheetId)}/values/${emailsSheetName}!${profileColumn}${rowNumberData}?valueInputOption=RAW`,
        options: {
          method: "PUT",
          body: JSON.stringify(rowDataEmails),
          headers: { "Content-Type": "application/json" }
        }
      });
    } else {
      console.warn(`Client name '${name}' not found in Data sheet. Skipping.`);
    }
  };
  task.complete()
} else if (data.getIndustryNews) {
  const pdf = blob.getContent(data.pdf);
  const obj = JSON.parse(pdf);
  const pdfBase64 = lib.base64.encode(obj);
  const today = new Date();
  const currentdate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const upload = connectors.googleDrive.uploadFile({
    name: `Industry_News_For_${data.industry}_${currentdate}`,
    content: pdfBase64,
    mimetype: "application/pdf",
    parentId: folderID
  });
  data.fileID = upload
  data.sendEmail = true
}

};
