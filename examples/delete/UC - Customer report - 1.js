/**
 * Step: UC - Customer report - 1
 * ID: djqjdxcbcnct3ae6zzq7zrfj8hyl9pdx
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
  UCAccountManager: true,
  response: Object,
  readReportStep : 1
};

export const content = async () => {
const retry = data.retry ?? 0
if (retry < 3) {
  task.park(data.response.reportTtlMin * 1000)
  step.redo()
  data.retry = retry
  data.readReportStep = 2
} else {
  console.log('Too many retry. Ending task.')
  task.complete()
}
};
