/**
 * Step: get industry news - part 1
 * ID: tvuwsbybboxe8qtawln4mzid99gwgxgt
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
nextStep: 1
};

export const content = async () => {
const industry = data.industry;
const today = new Date();
const currentdate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

const industryNewsPrompt = `You are a research analyst at anybank (https://anybankcapital.com/), a boutique Investment Bank that provides financial services to industry companies. You work for the lead partner at anybank in industry, who has worked for 20 years in indusry and you write research analyst reports for the partner.

Your partner sells financial services to CEO and CFO of ${industry} in the UK. The objective of this report is to provide use as a reference to be aware of current critical events, news and analysis to review before meetings with potential clients to sell them the financial transaction services. 

Please use all information available to you and provide a detailed report in HTML format suitable for conversion to PDF.  You must list sources with URL for additional detail and information when available. Include headings, sections, and any relevant data in a structured manner as per the following structure:

Report Title: UK ${industry} weekly research report on ${currentdate}
1. Global news highlights: Select the 5 most important global events and trends that impact financial transactions, consolidation trends and financial outlook (debt and capital raising impact) from the past 10 days in the global ${industry} industry - only include if specific to ${industry} industry. List them here as bullet points in order of relevance with a maximum of 20 words for each bullet point. You must include a link to the source.
2. UK News Highlights: Select the most important events in the UK ${industry} industry (up to 10) from the past 10 days and list them here as bullet points using a maximum of 25 words for each bullet point. You must Include a link to the source and the date published. Include regulatory change announcements, updates on underserved customer segments, financial transactions, industry news, CEO or CFO changes and newly released reports on the industry.
3. Transaction Highlights: List up to a maximum of 10 significant financial transactions (capital raising, debt issuance or merger, acquisitions or sale of company) made by any of the companies in the ${industry} company list (see below) in the past 10 days.

Important: 
If specific information requested is not found, do not assume or generate it and do not state that it could not be found. 
Do not add any Note or special characters. Please use UK British language.`
;

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

const industryNews = response.choices?.[0]?.message?.content || null;
const cleanedindustryNews = industryNews.replace(/<think>[\s\S]*?<\/think>/, '').trim();
data.industryNews1 = cleanedindustryNews;
data.nextStep = 2
};
