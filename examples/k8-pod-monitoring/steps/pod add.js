/**
 * Step: pod add
 * ID: bjcoyzzgww73mb7edpx83gu0v5iuvp0u
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

export const condition = {type: 'add', item: {kind: 'Pod'}};

export const content = async () => {
task.name('Pod added: ' + data.item.metadata.name)
task.tags(['pod', 'add'])
data.changeClassified = true
task.timeout(2000)
task.completeOnExpire();
};
