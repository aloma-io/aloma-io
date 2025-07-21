/**
 * Step: calc next release version
 * ID: cl81xe2sd01fn019284sgezsf
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

export const condition = {release: {latest: Object, next: null}};

export const content = async () => {
const releaseParts =
{
  major: 0,
  minor: 1,
  patch: 2
};

const part = data.releasePart || 'patch';

const nextVersion = (what) => {
  const parts = (what || '0.0.0').split(/\./);
  parts[releaseParts[part]]++;

  return parts.join('.');
}

if (!data.release?.latest?.request?.length) {
  task.ignore();
} else {
  data.release.next = nextVersion(data.release.latest.request[0].name)

  if (data.release.full === 'aloma-io/site' && data.release.next) {
    data.release.next = 't' + data.release.next?.replaceAll("t", "")
  }

  task.name(task.name() + ` -> ${data.release.next}`)
}

};
