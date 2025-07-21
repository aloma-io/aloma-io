/**
 * Step: classify pod update
 * ID: niczkxik775q5ccoj9ku3wto3fmxhkim
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

export const condition = {type: 'update', item: {kind: 'Pod'}};

export const content = async () => {
task.name('Pod updated: ' + data.item.metadata.name)

task.tags(['pod', 'update'])
data.changeClassified = true
task.timeout(2000)
task.completeOnExpire();
};
