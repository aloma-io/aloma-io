/**
 * Step: get industry news - subtask
 * ID: ochwmrum7lcn920536s43man1eck3z7x
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
runsubtask2: true
};

export const content = async () => {
console.log(data.company)
const company = data.company;
const companyName = company?.['Client name'];

const industryNewsPrompt = `For ${companyName}:
List any financial transactions, sales of a company, significant asset sales or partnerships announced, including activity/target, transaction value and strategic rationale.
List any changes to their financial situation and speculation, discussion by industry analysts or any announcements that may infer the company wants to acquire or sell itself.
List major news items, CEO or CFO statements or speaking events that might impact or have a bearing on financial transactions in the last 10 days.
Provide an assessment of the key topics being discussed publicly by the CEO and CFO of the company over the past 3 months.
Limit to a maximum of 5 bullet points per company with a maximum of 25 words for each bullet point and return in HTML format. You must Include the date published and a link to the source

Important: If specific requested information is not found, do not assume or generate it and do not state nothing is available. Do not add any Notes. Please use UK British language. Use HTML format.`;

const response = await connectors.perplexity.chat({
  model: 'sonar-deep-research',
  //model: 'llama-3.1-sonar-small-128k-chat',
  messages: [
    {
      role: "user",
      content: industryNewsPrompt
    }
  ],
  stream: false
});

const industryNews = response.choices?.[0]?.message?.content
const cleanedIndustryNews = industryNews.replace(/<think>[\s\S]*?<\/think>/, '').trim();
task.complete(cleanedIndustryNews)
};
