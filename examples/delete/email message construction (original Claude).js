/**
 * Step: email message construction (original Claude)
 * ID: w6cxxletlgs5gsmu95zp4mvgyes0yfrm
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
      companySearch: Array
    }],
    claude: true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  const companyName = company?.properties?.name;
  const website = company?.properties?.domain;
  const city = company?.properties?.city;
  const industry = company?.properties?.industry
  const companyAnalysis = company?.companyNews;
  const industryAnalysis = company?.industryNews;
  const month = company?.properties?.month;
  const year = company?.properties?.year;
  var dateref;

  if (year === 2023 || 2024) {
    dateref = month + ', ' + year;
  } else {
    dateref = year;
  }

  const email = `Hope all is well.

You may not remember us as we last spoke in ${dateref}. We're specialists at providing all-in-one commercial energy in the ${industry} sector, and each month we successfully reduce costs for our packaged customers. 

We offer support with Energy Procurement, Grants, on-site generation, Fixed and Flexible Options, Funding, Bureau services, Compliance, Net Zero planning, Siteworks, Metering, Waste Management, Onsite EV and much more, you can see here at our website: https://www.advantageutilities.com/

If you look after this sort of activity, shall we set up a 15-20 minute call https://meetings-eu1.hubspot.com/matthew54 to get better introduced and run through how it all works?

Cheers`;

  const messagePrompt = `You are an expert in lead generation and write cold emails to prospects. You are working for Advantage Utilities, a UK energy broker that provides electricity procurement and consulting services to reduces reduce customer energy costs by up to 20% through negotiating the purchase price of energy, increasing use of sustainable energy and advising on best practices to reduce energy consumption to save money and reduce their carbon footprint.

  Your job today is to write a subject line of maximum 7 words for the following cold outreach email - do not use the company name in the subject line.

  ${email}

  Return only the subject line without any introductory text or explanations or any additional formatting or punctiuation such as "**" or ##" in the following format:
  Subject: (use a maximum of 7 words)`;

  const response = await connectors.claudeAi.chat({
     model: 'claude-3-haiku-20240307',
     messages: [
      {
        "role": "user",
        "content": `${messagePrompt}`
      }
     ],
     stream: false
   });

  const message = response?.content?.[0]?.text;

  const subjectMatch = message.match(/Subject:\s*(.+)/);
  
  const subject = subjectMatch ? subjectMatch[1].trim() : "";

  if (data.console === true) {
    console.log(`Subject for ${companyName}: `, subject)
    console.log(`Email for ${companyName}: `, email)
  };

  company.subject = subject;
  company.message = email
}

if (data.googleSheet === false) {
  data.addToHubspot = true;
}
};
