/**
 * Step: data from google sheet
 * ID: ovk92q6s23l36f96i1nhtcj2zph936qk
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
    name: "googleSheet"
  }
};

export const content = async () => {
console.log("data: ", data)
task.name("Adding To HubSpot")
data.addToHubspot = true
};
