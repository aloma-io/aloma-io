/**
 * Step: connector image update successful
 * ID: cl6xpzgma00hm019y3vdeaorm
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

export const condition = {connector: {update: {status: 200}}};

export const content = async () => {
const text = `infrastructure rollout: connector ${data.build.connectorId} ${data.build.version}`

const slackChannel = task.config("SLACK_CHANNEL")
connectors.slackCom.send({ text: text, channel: slackChannel })
task.complete()
};
