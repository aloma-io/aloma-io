/**
 * Step: check profile (James)
 * ID: u9nsebj1flgx7pyzjvfmmlhwiti8sqbc
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
  "$via": {
    name: "dux-soup-James"
  }
};

export const content = async () => {
if (data.event !== "update" || data.data.Email === "") {
  task.ignore()
}
task.name(`Dux-Soup Automation for ${data.data['First Name']} ${data.data['Last Name']}`)
const linkedin_url = data.data.Profile;
console.log(linkedin_url)
const sheetId = task.config("JAMES_DUX_SPREADSHEET");

const response = await connectors.googleSheets.request({
  url: `/${encodeURIComponent(sheetId)}/values/${encodeURIComponent('JAMES DUX')}`
});

const rows = response.values || [];
const columnBValues = rows.slice(1).map(row => row[1]);
const updatedValues = columnBValues.map(url => {
  return url && !url.endsWith('/') ? url + '/' : url;
});

if (!updatedValues.includes(linkedin_url)) {
  task.ignore();
} else if (!data.data.Email || data.data.Email.trim() === "") {
  console.log("no email")
  task.ignore();
} else {
  data.visitData = true
}
};
