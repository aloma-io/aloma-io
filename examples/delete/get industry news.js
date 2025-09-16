/**
 * Step: get industry news
 * ID: bhlkgbska40xxaalnkclhlg3cfo3ymff
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
  hubspotCompanies: [{
       companyNews: String
  }],
  AIEnrich:true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  if (data.production) {
    const contacts = company?.validatedContacts;
    if (contacts?.length === 0) {
      //console.log(`no contacts with valid emails for company ${company?.properties?.name}. Skipping AI enrichment`)
      company.industryNews = '';
      continue;
    }
  }
  if (company?.properties?.generate_message === "Complete") {
    company.industryNews = `${company?.properties?.aloma_industry}`
    continue
  }
  const companyName = company?.properties?.name;
  const industry = company?.properties?.industry ?? company?.properties?.hs_industry_group;

  if (!industry) {
    console.log(`Skipping industry news generation for contact ${companyName} due to missing industry info.`);
    company.industryNews = `Skipping industry news generation for contact ${companyName} due to missing industry info.`;
    continue;
  }

  const industryNewsPrompt = `You are an expert analyst at Advantage Utilities (www.advantageutilities.com) and your job is to research industries and prepare background information to use when writing cold emails or making cold calls to companies to pitch reducing energy costs by up to 20%.

  Please prepare a concise, attention-grabbing analysis in one paragraph with a maximum of 150 words on how companies in the ${industry} industry can reduce their energy costs in the UK for background information to use when writing cold emails or making cold calls to companies to pitch reducing energy costs by up to 20%.

  Include the following in the analysis:

  - One striking statistic or fact about why companies in the ${industry} industry need to worry about energy costs
  - Most relevant recent news (within last 3 months) about companies in the ${industry} industry saving on energy consumption and name the company
  - Top opportunity for significant energy cost reduction in ${industry}, with quantified benefits if possible
  - One clear, actionable recommendation on a service that Advantage Utilities can offer to companies in ${industry}

  Important: If specific information requested is not found, do not assume or generate it and do not state that it could not be found. Do not add any Note. Do not add sources. Please use UK British language.`;

  const response = await connectors.perplexity.chat({
    model: 'sonar',
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

  if (data.console) {
    console.log(`Industry News for ${companyName}: `, cleanedindustryNews)
  };

  company.industryNews = cleanedindustryNews;
}

if (data.duxSoup) {
  data.updateCreateHubspot = true
}
};
