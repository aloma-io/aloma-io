/**
 * Step: create tag
 * ID: cl81xiuwq01gf01929j03439p
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
  release: {
    next: String,
    tagged: null
  }
};

export const content = async () => {
connectors.githubCom.request({
    into: `release.tagged`, url: "POST /repos/{org}/{repo}/git/refs", arg:
    {
        org: data.release.org,
        repo: data.release.name,
        ref: `refs/tags/${data.release.next}`,
        sha: data.release.commit
    }
})
};
