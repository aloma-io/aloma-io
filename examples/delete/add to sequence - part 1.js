/**
 * Step: add to sequence - part 1
 * ID: grmdp5yp1a7xyts8q9ej5jvree7risrg
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
  addToSequence: true,
  nextStep: 1
};

export const content = async () => {
const i = data.index

if (i < data.hubspotCompanies.length) {
  data.nextStep = 2
  if (i > 0) {
    task.park(30000)
  }
  step.redo()
} else {
  task.complete()
}
};
