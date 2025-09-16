/**
 * Step: check FullEnrich
 * ID: dt319daz5f00j6glvp919hkzbin92gpw
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
checkFullEnrich: true,
production: false
};

export const content = async () => {
/* const apiKey = task.config("FULLENRICH_KEY")
const creditOptions = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
};
const creditCheck = await connectors.fetch({ url: 'https://app.fullenrich.com/api/v1/account/credits', options: creditOptions })
if (creditCheck.body.balance < 100) {
  console.log("FullEnrich credits less than 100")
  task.complete()
} else {
  data.getContacts = true
} */
data.getContacts = true
};
