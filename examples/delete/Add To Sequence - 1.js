/**
 * Step: Add To Sequence - 1
 * ID: mav7dfe7wf8aup367famyxzw3yqnstw5
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
  "addSeqStep": 1
};

export const content = async () => {
const index = data.index

if (index < data.contacts.length) {
  data.addSeqStep = 2
  step.redo()
} else {
  data.reportErrors = true
}
};
