/**
 * Step: get company search
 * ID: k7ipem8flpi6zduqzzo2gkztrx23ncmy
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
         industryNews: String
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
      company.companySearch = [];
      continue;
    }
  }
  if (company?.properties?.generate_message === "Complete") {
    company.companySearch = []
    continue
  }
  const companyName = company?.properties?.name;

  const query = {
    "q": `"${companyName}" news`
  };

  const response = await connectors.fetch({
    url: "https://google.serper.dev/search",
    options: {
      method: "POST",
      headers: {
        'X-API-KEY': '88896f12a99f29910bcc5f429da90b4f8fea9bfd',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    }
  });

  let localNewsPages = [];
  for (const newsPage of response?.body?.organic) {
    localNewsPages.push({
      title: newsPage.title,
      link: newsPage.link,
      date: newsPage.date,
      snippet: newsPage.snippet
    });
  }

  if (data.console) {
    console.log(`Company Search for ${companyName}`, localNewsPages)
  };

  company.companySearch = localNewsPages;
}
if (data.duxSoup) {
  data.updateCreateHubspot = true
}
};
