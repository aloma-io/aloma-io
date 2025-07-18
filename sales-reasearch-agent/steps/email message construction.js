/**
 * Step: email message construction
 * ID: rd30jm732r4mc2l7pu3qzdct0xdejzwl
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
getCompanyNews: true,
companies: [{
    response: Object
    }],
 nextStep: 3
};

export const content = async () => {
for (const company of data.companies) {
  const ceo = company.Name;
  const companyName = company?.['Client name'];
  const companyNews = company.companyNews;

  const messagePrompt = `You are an expert in lead generation and write cold emails to potential prospects. 

  You are creating an email on behalf of a partner in an investment bank to send to the CEO of a prospective client company. You work for AnyBank (https://anybank.com/), a boutique bank that specialises in advising companies on financial advisory services. The partner you are representing is the lead partner for anyindustry. 

  Your job today is to write a sentence of maximum 35 words to put in a cold email that is to be sent to the CEO of ${companyName}. The sentence should reference the main competitive threat the company faces, a potential solution to this threat, the most relevant announced growth event in the last 6 months and that ${companyName} is a leading company amongst its competitors. 

  Also write a subject line for the email that emphasizes the proposed problem and your sector expertise and that will grab a CEO's attention and stand out from other emails. Use this as an example: "Strategic Partnership Opportunity to Navigate ${companyName}’s Next Phase" .  

  Return only the subject line followed by the paragraph without any introductory text or explanations.
  You must return in the following format with the titles "Subject" and "Paragraph":
  Subject: (use a maximum of 9 words)
  Paragraph: (use a maximum of 35 words)

  Use the information below to generate both the subject and the sentence:

  ${companyNews}.`;

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
  const paragraphMatch = message.match(/Paragraph:\s*([\s\S]*)/);

  const subject = subjectMatch ? subjectMatch[1].trim() : "";
  const paragraph = paragraphMatch ? paragraphMatch[1].trim() : "";

    //A formal, professional email to be sent to a CEO - a template is used to ensure compliance. 
  const email = `Dear [CEO],

  My name is xxx, Partner at anybank...

  Companies are looking to partner with you to scale and meet their AI needs. ${paragraph}. Investors...

  I'd welcome a brief call to discuss how we can support ${companyName} in:
  1. Point 1
  2. Point 2
  3. Point 3
  
  Anybank is an independent... 
  • Case study 1
  • Case study 2
  • Case study 3

  Would you be available for a call next week? I'm confident...

  Partner, anybank`;

  company.subject = subject;
  company.message = email
}
};
