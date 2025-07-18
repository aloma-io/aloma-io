/**
 * Step: get industry news - part 3
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
nextStep: 3
}
;

export const content = async () => {
const companies = data.companies;
const batchSize = 4;
const initialIndex = data.index

const batch = companies.slice(initialIndex, initialIndex + batchSize);
for (let i = 0; i < batch.length; i++) {
  const name = `subtask for ${ batch[i]?.['Client name'] }`
  task.subtask(name, { company: batch[i], runsubtask2: true }, { into: `companies.${initialIndex + i}.response`, waitFor: true })
}
data.index = initialIndex + batchSize
console.log('next index ',initialIndex + batchSize)
data.nextStep = 2
step.redo()
};
