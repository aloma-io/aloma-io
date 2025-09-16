/**
 * Step: get linkedin urls (James)
 * ID: qtqliastbtuaeibtoi1cs89tpoii7i7g
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
visitProfilesJames: true
};

export const content = async () => {
const sheetId = task.config("JAMES_DUX_SPREADSHEET");
const response = await connectors.googleSheets.request({
  url: `/${encodeURIComponent(sheetId)}/values/${encodeURIComponent('JAMES DUX')}`
});

const rows = response.values || [];
const linkedinUrls = rows
  .map(row => row[1])
  .filter(cell => typeof cell === "string" && cell.startsWith("https://www.linkedin.com/"))
  .slice(221);

console.log(linkedinUrls);


for (const profile of linkedinUrls) {
    try {
    const visitProfile = await connectors.duxSoup.visit({ linkedinProfileURL: profile });
    console.log(`Visit requested: ${profile}`);
    console.log(visitProfile)
  } catch (err) {
    console.error(`Failed to request visit ${profile}:`, err);
  }
}
task.complete()
};
