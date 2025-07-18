/**
 * Step: generate pdf
 * ID: e4f6i9bhivnvraskaut52j71jjagapzx
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
generatePDF: true
};

export const content = async () => {
if (data.getCompanyNews) {
  for (const company of data.companies) {
    const pdf = await connectors.documentGeneration.pdf({ content: `${company?.response?.result}\n\n`, layout: `<html><head></head><body style="padding: 2rem">{{{content}}}</body></html>` });

    company.pdf = blob.create({ content: pdf });
  }
} else if (data.getIndustryNews) {

  const pdf = await connectors.documentGeneration.pdf({ content: `${data.industryNews}\n\n`, layout: `<html><head></head><body style="padding: 2rem">{{{content}}}</body></html>` });
  data.pdf = blob.create({ content: pdf });
}
data.pdfCreated = true
};
