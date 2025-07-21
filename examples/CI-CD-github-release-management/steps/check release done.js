/**
 * Step: check release done
 * ID: cl81yh6io01s4019290rq92lj
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

export const condition = {release: {released: {url: String}}};

export const content = async () => {
const text = `${data.release.name} ${data.release.next} released.`
const slackChannel = task.config("SLACK_CHANNEL")
connectors.slackCom.send({ text: text, channel: slackChannel })

task.complete();
};
