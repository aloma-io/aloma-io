/**
 * Step: get latest tag
 * ID: cl81x94x101el0192azf33lp8
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
  release: {latest: null}
};

export const content = async () => {
connectors.githubCom.request({ into: `release.latest`, url: "GET /repos/{org}/{repo}/tags?per_page=10", arg: { org: data.release.org, repo: data.release.name } })
};
