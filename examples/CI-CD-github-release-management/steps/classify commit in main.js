/**
 * Step: classify commit in main
 * ID: cl81wyzoh01cy0192cj6nh00m
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
  ref: "refs/heads/main",
  repository: {
    name: String
  },
  head_commit: {
    id: String
  },
  organization: Object
};

export const content = async () => {
const parts = data.ref.split(/\//);

task.tags(['commit', parts[parts.length - 1]])

if ((parts[2] === 'MAIN_BRANCH' || parts[2] === 'MAIN_BRANCH_2') && !(data.repository.name === 'REPO_NAME' || data.repository.name === 'REPO_NAME_2'))
{
    task.name(`release ${data.repository.name}`);
    const release = { org: data.organization.login, branch: parts[2], full: data.repository.full_name, name: data.repository.name, commit: data.head_commit.id }
    Object.keys(data).forEach((k) => delete (data[k]));
    data.release = release;
    
} else {
    task.ignore();
}
};
