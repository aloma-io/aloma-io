/**
 * Step: UC - get token
 * ID: qv1jsgkdi92b6ejpw1v0q5zum2b0f9xo
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
getUCToken:true,
scope:String
};

export const content = async () => {
const password = task.config("UCPassword");
const scope = data.scope
const params = `grant_type=client_credentials&scope=${scope}&client_id=sam.l@advantageutilities.com&client_secret=${password}`
const response = connectors.fetch({
  url: `https://advantageutilities.administrate.online/auth/connect/token`,
  options: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    },
    body: params
  }
})

data.uc_access_token = response.body.access_token
};
