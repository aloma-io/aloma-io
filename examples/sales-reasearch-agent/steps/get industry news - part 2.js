/**
 * Step: get industry news - part 2
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
getIndustryNews: true,
companies: Array,
nextStep: 2
};

export const content = async () => {
const i = data.index
console.log(' i ', i)
  
if (i < data.companies.length) {
  data.nextStep = 3
  step.redo()
} else {
  data.nextStep = 4
}
};
