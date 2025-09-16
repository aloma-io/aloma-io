/**
 * Step: Claude refine email content
 * ID: sax8t9bcnhvb2nz6g9vz4c98gxng0rvn
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
      subject: String,
      paragraph: String,
      challenges: String
    }],
   production: true
};

export const content = async () => {
for (const company of data.hubspotCompanies) { 
  if (data.production) {
    const contacts = company?.validatedContacts;
    if (contacts?.length === 0) {
      //console.log(`no contacts with valid emails for company ${company?.properties?.name}. Skipping AI enrichment`)
      company.email = '';
      continue;
    }
  }
  if (company?.properties?.generate_message === "Complete") {
    company.email = `${company?.properties?.ai_email}`
    continue
  }
  const companyName = company?.properties?.name;
  const month = company?.properties?.month;
  const year = company?.properties?.year;

  let sentence
  if (company?.properties?.ucDate === false) {
    sentence = 'I was hoping to speak with you about partnering to reduce your energy costs.'
  } else {
    let dateref;
    if (year === 2025 || year === 2024) {
      dateref = 'in ' + month + ' ' + year;
    } else {
      dateref = 'over a year ago';
    }
    sentence = `I am not sure if you remember but we last spoke ${dateref} about partnering to reduce your energy costs.`
  }
  const paragraph = company?.paragraph;

  const messagePrompt = `Could you please rewrite these AI-generated sentences to sound more natural and friendly but professional. Please use British English instead of American English. When rewriting please ensure that it is being written from the perspective that I (Advantage Utilities) are offering my services to a potential prospect. Rewrite anything that might imply that I am working for the prospect, acting on behalf of the prospect or that the prospect is an existing customer:
  "${paragraph}"
  Only return the rewritten sentences, do not return any special characters, numbers or any other text include notes, explanations, introduction or restating what you have been asked to do.`

  const response = await connectors.claudeAi.chat({
    model: 'claude-3-7-sonnet-20250219',
    messages: [
      {
        "role": "user",
        "content": `${messagePrompt}`
      }
    ],
    stream: false
  });

  const message = response?.content?.[0]?.text;
  const cleanedMessage = message?.replace(/^"|"$/g, '');
  company.paragraph = cleanedMessage

  const sample = company.emailData?.["Full message (information only)"];
  const subject = company.subject;

   const refinedEmail = `
 Hope all is well.<br><br>
  
 ${sentence} ${cleanedMessage}<br><br>
  
 I'd love to share insights on how we can help ${companyName} improve its energy efficiency. Would you mind if we set up a 15-20 minute call to get better introduced and run through how it all works? Just reply to this email with a convenient time or use my booking link below to find a time.<br><br>
  
 Alternatively, if you can send me your energy contract renewal date, I would be happy to call you and guide you through the energy purchasing landscape at that time.`;

  company.sentence = sentence
  company.email = refinedEmail;
//  console.log(refinedEmail)
  
}
if (data.production) {
  data.googleSheetStep = true
} else if (data.duxSoup) {
  data.updateCreateHubspot = true
}
};
