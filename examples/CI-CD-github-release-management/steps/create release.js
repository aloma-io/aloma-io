/**
 * Step: create release
 * ID: cl81xytr501lb01923kcg7jq7
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
    tagged: {
      ref: String
    }
  }
};

export const content = async () => {
connectors.githubCom.request({
    into: `release.released`, url: "POST /repos/{org}/{repo}/releases", arg:
    {
        org: data.release.org,
        repo: data.release.name,
        tag_name: data.release.next,
        target_commitish: data.release.branch,
        name: data.release.next,
        body: '',
        draft: false,
        prerelease: false,
        generate_release_notes: false
    }
})
};
