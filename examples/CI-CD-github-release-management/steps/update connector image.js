/**
 * Step: update connector image
 * ID: cl6xpk2fi6yf301ek954a4i6c
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
  build: {
    type: "connector",
    connectorId: String,
    image: String
  }
};

export const content = async () => {

task.tags(['connector', 'image', 'update']);
task.name(`connector rollout ${data.build.connectorId} -> ${data.build.version}`);
// Example of how to update the connector image
// connectors.fetch({
//     url: 'URL', options:
//     {
//         body: JSON.stringify({
//              variables: { marketId: data.build.connectorId, image: data.build.image }
//         }),
//         headers: { 'Content-type': 'application/json', 'Authorization': 'TOKEN'},
//         method: 'POST'
//     }
// })
};
