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

  You are creating an email on behalf of a partner in an investment bank to send to the CEO of a prospective client company. You work for Aalto Capital (https://aaltocapital.com/), a boutique investment bank that specialises in advising Telecom companies on capital raising and acquisition strategies, including fundraising, acquisition, merger and strategic partnership advisory services. The partner you are representing has 35 years of experience in Telecoms, is the lead partner for Telecoms and used to be GM for International Business at Verizon. 

  Your job today is to write a sentence of maximum 35 words to put in a cold email that is to be sent to the CEO of ${companyName}. The sentence should reference the main competitive threat the company faces, a potential solution to this threat, the most relevant announced growth event in the last 6 months and that ${companyName} is a leading company amongst its competitors. 

  Also write a subject line for the email that emphasizes the proposed problem, that Aalto has sector expertise and that will grab a CEO's attention and stand out from other emails. Use this as an example: "Strategic Partnership Opportunity to Navigate ${companyName}’s Next Phase" .  

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

  const email = `Dear [CEO],

  My name is Richard Montgomery, TMT Partner at Aalto Capital and former General Manager for International Business at Verizon. I work with CEOs to help/advise high-growth connectivity companies to navigate the current AI transition based on my 35 years of experience leading telecom companies through technology transitions. 

  Companies are looking to partner with leading ISPs with the infrastructure to scale and meet their AI needs. ${paragraph}. Investors are now active in the UK ISP market, backing transactions (FullFibre/ZZoomm merger, Gigafibre’s fundraising) and as industry consolidation accelerates, we can work with you to ensure your success in the industry.

  I'd welcome a brief call to discuss how we can support ${companyName} in:
  1. Attracting AI/cloud-focused investors—a segment commanding 30%+ premium valuations.
  2. Optimizing capital strategy to balance expansion, customer density, and competitive positioning.
  3. Exploring strategic partnerships or M&A opportunities to strengthen market leadership
  
  Aalto Capital is an independent Pan-European corporate finance advisor with offices in London, Helsinki, Munich, Stockholm, Zurich and Oslo.  We have an extensive investor base in Europe, US and APAC of over 3,000 private equity, HNWI and strategic investors who are looking for attractive investment opportunities. I lead our TMT team in London, focusing on equity fundraising and M&A and providing strategic advice to our clients which include a number of growing businesses like Hyperoptic. Our track record includes:
  • Structuring a £[X]M growth equity round for a UK [xxx] provider to accelerate rollout in [xxx] markets.
  • Facilitating a strategic partnership between [X] and a global [Y] provider.
  • Advising on an acquisition that expanded a client’s [xxxx].  PERHAPS YOU CAN ADD EMILIO AND KRZYSZTOF’S TRACK RECORD HERE

  Would you be available for a call next week? I'm confident we can add immediate value, whether through refining your capital strategy or identifying untapped opportunities.

  Richard Montgomery
  Partner, Aalto Capital`;

  company.subject = subject;
  company.message = email
}
};
