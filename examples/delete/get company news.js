/**
 * Step: get company news
 * ID: s5naj3o2waltab0uuewb22fdcyrzidv6
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
  AIEnrich: true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  if (data.production) {
    const contacts = company?.validatedContacts;
    if (contacts?.length === 0) {
      //console.log(`no contacts with valid emails for company ${company?.properties?.name}. Skipping AI enrichment`)
      company.companyNews = '';
      continue;
    }
  }
  if (company?.properties?.generate_message === "Complete") {
    company.companyNews = `${company?.properties?.aloma_company}`
    continue
  }
  const companyName = company?.properties?.name;
  const companyWebsite = company?.properties?.domain;
  const city = company?.properties?.city;

  const companyNewsPrompt = `You are an SDR and your job is to research companies and prepare background information to use when writing cold emails or making cold calls. You are working for Advantage Utilities (www.advantageutilities.com), a company that provides consulting services and reduces customer energy costs by 20% through negotiating the purchase of energy, advising to drive down consumption whilst exploring energy efficiency technology to help clients reduce their carbon footprint.

  Please prepare a concise research note consisting of one paragraph with a maximum of 150 words and include an overview of ${companyName} (website: ${companyWebsite}), the latest news from the company and the date published in the last 3 months, any statements, news, or articles from the company on energy or ESG and any specific energy pricing or consumption issues local to ${city} and region where they are located.

  Important: If specific requested information is not found, do not assume or generate it and do not state nothing is available. Do not add any Note. Do not add sources. Please use UK British language.`;

  const response = await connectors.perplexity.chat({
    model: 'sonar-pro',
    messages: [
      {
        role: "user",
        content: companyNewsPrompt
      }
    ],
    stream: false
  });

  const companyNews = response.choices?.[0]?.message?.content
  const cleanedCompanyNews = companyNews?.replace(/<think>[\s\S]*?<\/think>/, '').trim();

  company.companyNews = cleanedCompanyNews;
}

};
