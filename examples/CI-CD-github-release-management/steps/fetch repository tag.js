/**
 * Step: fetch repository tag
 * ID: cl81viqtr00mk0192bluxebzm
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
  repos: Array
};

export const content = async () => {
data.tags = data.tags || {};

const repo = data.repos.shift();
if (!repo)
{
    delete (data.repos);
} else {
    connectors.githubCom.request({ into: `tags.${repo.name}`, url: "GET /repos/{org}/{repo}/tags?per_page=10", arg: { org: 'ORG_NAME', repo: repo.name } })
    step.redo();
}
};
