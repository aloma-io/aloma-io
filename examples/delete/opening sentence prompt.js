/**
 * Step: opening sentence prompt
 * ID: vyqfa0dy1lxqgar9utr4cz9lolrdiutl
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
  hubspotContacts: {
    results: [{
        message: String
      }]
  }
};

export const content = async () => {
const config = { "model": "gpt-4o", "provider": "openai", "maxTokens": 512, "temperature": 0.1 }
const contacts = data.hubspotContacts.results;

for (const contact of contacts) {
  const companySearch = contact?.companySearch || []
  const linkedInURL = contact.properties?.linkedin_url
  const companySearchItems = companySearch.map(item => `${item.title}: ${item.snippet} (${item.link})`).join("\n");

  const openingSentencePrompt = `You are an expert in lead generation and write cold emails to prospects. You are working for Advantage Utilities, a company that provides consulting services and reduces reduce customer energy costs by 20% through negotiating the purchase of energy, advising to drive down consumption whilst exploring energy efficiency technology to help clients reduce their carbon footprint.

Your job today is to write an opening sentence for a cold outreach email to personalise it by recognising something that person has posted to LinkedIn or a recent news item. The post should be related to an accomplishment, exhibition, new product launch or success, which must be referenced in the sentence. Please select one of the items from the following Linkedin posts: ${linkedInURL} and news items ${companySearchItems}

The sentence should have between 8 and 15 words, only return the sentence - no other information, do not put "Dear name" at the beginning and do not add any quotes or other punctuation.`;

  const response = connectors.openaiCom.chat({
    model: config?.model,
    messages: [
      {
        role: "user",
        content: openingSentencePrompt
      }
    ],
    stream: false
  });

  const openingSentence = response.choices[0].message.content
  console.log("openingSentence: ", openingSentence)
  contact.openingSentence = openingSentence
}
};
