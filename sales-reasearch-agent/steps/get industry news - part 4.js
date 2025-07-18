/**
 * Step: get industry news - part 4
 * ID: nuvg68cii9i2buhs1qhj7tdhv87x3ckh
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
nextStep: 4
};

export const content = async () => {
const prompt1Response = data.industryNews1
let prompt2Responses = '';

for (const company of data.companies) {
  const companyName = company?.['Client name'];
  const prompt2Output = company?.response?.result;
  prompt2Responses += `\n\n<h2><b>${companyName}</b></h2>\n\n${prompt2Output}\n\n---\n\n`;
}

const industryNews = `${prompt1Response}\n\n${prompt2Responses}`;

data.industryNews = industryNews
data.generatePDF = true
};
