/**
 * Step: get company news - subtask
 * ID: vnpcwf78k5283oyev0hema1j8dvs1qko
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
runsubtask: true
};

export const content = async () => {
console.log(data.company)
const company = data.company;
const companyName = company?.['Client name'];
//const companyWebsite = company.Website;
//I added line below - please check for accuracy
const industry = company?.['Business Industry Type'];
//const ceo = company.Name;

const companyNewsPrompt = `You are a research analyst at anybank (https://anybank.com/), a bank that provides financial advisory services to industry companies. You work for a partner at anybank who has worked for 20 years in industry.

Your job is to research UK ${industry} in the Telecom sector to prepare a two-page, concise, report in HTML format for partners to sell these companies financial services. The research summarises the competitive landscape, and identifies recent financial transactions by their direct competitors and trends in their sub-segment of the industry - identifying any particular threats or opportunities facing the specific company. This report will be provided to the partner to prepare for an upcoming sales meeting as a briefing of all key points. 

Today you are researching ${companyName} (website: ${website}) and preparing a report for a partner who will be meeting with ${ceo}. 

Please use all information available to you to write this report and list sources with URL for additional detail and information when available. 

Structure the report in HTML format with the following headers.

Report Title: ${companyName}) Background Report
CEO: ${ceo}
  1. Industry segment: top 3 products or services of ${companyName} in the ${industry} segment
  2. Key financial metrics: publicly available information on revenue, EBITDA, profit/loss, valuation for ${companyName}
  3. Latest news: Summarise the latest news from the company and the date published and any statements, news, or articles from or about the company on funding, growth plans or projects. For each of these provide the source with URL.
  4. Significant transactions by ${companyName}: A list of any significant transactions, acquisitions or sales of a company or major asset, major sales or partnerships with third parties or raising capital, in the last two years including activity/target, transaction value and strategic rationale.
  5. Competitors: Identify the top 4 competitors of this company in ${industry} based on having a similar revenue and being in the UK, provide a profile of their core activities, their revenue for the last financial year and current valuation.
  6. Competitor transactions: Identify any recent transactions announced in the last 6 months, such as acquisitions, sales or spin offs, major partnerships or fundraising, to understand market dynamics and opportunities.
  7. AI impact: Analyse the impact of AI on the company and its top competitors with a particular focus on data hosting, bandwidth capacity and data privacy, focusing on how these developments may influence their business strategies.
  8. Consolidation trends: Assessment of broader market consolidation trends in the Telecom industry to identify potential strategic partnerships or investment opportunities for the company.
  9. Potential Transactions: Please provide 3 recommended transactions (fundraising, partnerships, acquisition, asset sale, etc) that ${companyName} should consider considering current market trends in the broader telecommunications industry and its current market position vis-a-vis its competitors.

Important: If specific requested information is not found, do not assume or generate it and do not state nothing is available. Do not add any Notes. Please use UK British language. Use HTML format.`;

const response = await connectors.perplexity.chat({
  model: 'sonar-deep-research',
  //model: 'llama-3.1-sonar-small-128k-chat',
  messages: [
    {
      role: "user",
      content: companyNewsPrompt
    }
  ],
  stream: false
});

const companyNews = response.choices?.[0]?.message?.content
const cleanedCompanyNews = companyNews.replace(/<think>[\s\S]*?<\/think>/, '').trim();
task.complete(cleanedCompanyNews)
};
