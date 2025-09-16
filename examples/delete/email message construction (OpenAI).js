/**
 * Step: email message construction (OpenAI)
 * ID: oe713s9tdr7082hkhbe16v79ksaik0n6
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
      emailData: Object
    }],
  production: true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  if (data.production) {
    const contacts = company?.validatedContacts;
    if (contacts?.length === 0) {
      console.log(`no contacts with valid emails for company ${company?.properties?.name}. Skipping AI enrichment`)
      company.subject = 'subject';
      company.email = ''
      company.challenges = 'challenge'
      company.paragraph = ''
      continue;
    }
  }
  if (company?.properties?.generate_message === "Complete") {
    company.subject = `${company?.properties?.aloma_subject}`;
    company.email = `${company?.properties?.ai_email}`
    company.challenges = `${company?.properties?.aloma_challenge}`
    company.paragraph = `${company?.properties?.ai_paragraph}`
    continue
  }
  const companyName = company?.properties?.name;
  const website = company?.properties?.domain;
  const city = company?.properties?.city;
  const industry = company?.properties?.industry
  const month = company?.properties?.month;
  const year = company?.properties?.year;
  const companyNews = company?.companyNews;
  const industryNews = company?.industryNews;
  let companyDescription = ''
  //console.log('companyNews', companyNews)
  if (company.properties?.about_us) {
    companyDescription = company.properties?.about_us
  } else {
    companyDescription = company?.companyNews
  } 

  const emailData = company.emailData

  const systemPrompt = emailData?.systemPrompt
  const aiGenPrompt = emailData?.openAIPrompt

  const messagePrompt = aiGenPrompt
    .replace(/\${companyNews}/gi, companyNews)
    .replace(/\${industryNews}/gi, industryNews)
    .replace(/\${companyName}/gi, companyName)
    .replace(/\${city}/gi, city)
    .replace(/\${website}/gi, website)
    .replace(/\${companyDescription}/gi, companyDescription)
    .replace(/\${website}/gi, website)
    .replace(/\${industry}/gi, industry);

  //console.log('messagePrompt: ', messagePrompt)
  //console.log('companyNews: ', companyNews)
  //console.log('industryNews: ', industryNews)
  

  const response = await connectors.openaiCom.chat({
    model: 'gpt-4o',
     messages: [
       {
         "role": "system",
          "content": `${systemPrompt}`
       },
       {
          "role": "user",
         "content": `${messagePrompt}`
      }
     ],
     stream: false
   });

//const message = response.choices?.[0]?.message?.content;
  company.paragraph = response.choices?.[0]?.message?.content;
  company.subject = "subject"
  company.challenges = "challenges"

//  console.log('AI output ', company.paragraph);

  /*const subjectMatch = message.match(/Subject:\s*(.+)/);
  const paragraphMatch = message.match(/Paragraph:\s*(.+)/);
  const challengesMatch = message.match(/Background:([\s\S]*?)Solution 3: (.+)/);*/
  
  /*const subject = subjectMatch ? subjectMatch[1].trim() : "";
  const paragraph = paragraphMatch ? paragraphMatch[1].trim() : "";
  const challenges = challengesMatch ? `Background:\n${challengesMatch[1].trim()}\nSolution 3: ${challengesMatch[2].trim()}` : "";*/

  //company.subject = subject;
  //company.paragraph = paragraph;
  //company.challenges = challenges
}

if (data.googleSheet === false) {
  data.addToHubspot = true;
}
};
