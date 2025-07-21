/**
 * Step: tag with new release
 * ID: cl81vx4xo00vp01927r9v1sbt
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
  repos: null,
  tags: Object
};

export const content = async () => {
data.releases = data.releases || {};
const key = Object.keys(data.tags)[0]
const releaseParts =
{
    major: 0,
    minor: 1,
    patch: 2
};

const part = data.releasePart || 'patch';

const nextVersion = (what) =>
{
    const parts = what.split(/\./);
    parts[releaseParts[part]]++;

    return parts.join('.');
}

if (!key)
{
    task.complete();
} else {
    const latest = data.tags[key].request[0]?.name
    delete (data.tags[key]);
    if (latest)
    {
        const next = nextVersion(latest);
        audit.log(`release ${key}: ${latest} -> ${next}`)

        connectors.githubCom.request({
            into: `releases.${key}`, url: "POST /repos/{org}/{repo}/releases", arg:
            {
                org: 'ORG_NAME',
                repo: key,
                tag_name: next,
                target_commitish: 'master',
                name: next,
                body: '',
                draft: false,
                prerelease: false,
                generate_release_notes: false
            }
        })
    }
    
    step.redo();
}
};
