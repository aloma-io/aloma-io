/**
 * Step: find all connector repositories
 * ID: cl81p0svs04hw01ba0iur19dl
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
  release: "connectors"
};

export const content = async () => {
connectors.githubCom.request({ into: 'repos', url: "GET /orgs/{org}/repos?per_page=10", arg: { org: 'ORG_NAME' } })
};
