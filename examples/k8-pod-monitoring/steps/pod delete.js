/**
 * Step: pod delete
 * ID: dm81zbsa1xph8oj30vosxjuf39slxlrs
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

export const condition = {type: 'delete', item: {kind: 'Pod'}};

export const content = async () => {
task.name('Pod deleted: ' + data.item.metadata.name)
task.tags(['pod', 'delete'])
data.changeClassified = true
task.timeout(2000)
task.completeOnExpire();
};
