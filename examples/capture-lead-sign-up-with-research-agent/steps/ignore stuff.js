/**
 * Step: ignore stuff
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
  subject: (what) => what?.includes && (what.includes('meeting')||what.includes('Meeting') || what.includes('Jira')),
  attachments: Array,
  textAsHtml: String
};

export const content = async () => {
task.
  ignore();
};
