/**
 * Step: filter connector repositories
 * ID: cl81vc6el00ky01926lx3eff6
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
  repos: {
    request: Array
  }
};

export const content = async () => {
data.repos = data.repos.request.filter((repo) => repo.name.startsWith('connector-'))
};
