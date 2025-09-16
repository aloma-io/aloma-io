/**
 * Step: email message construction (OpenAI) - replace existing messages
 * ID: gurc4c3qeju98w5s4o8sd1iolxfer6y0
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
      contacts: Object
    }], 
    messageReplace:true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  const companyName = company?.properties?.name;
  const website = company?.properties?.domain;
  const city = company?.properties?.city;
  const industry = company?.properties?.industry
  const industryAnalysis = company?.industryNews;
  const month = company?.properties?.month;
  const year = company?.properties?.year;
  let companyDescription = ''
  /*if (company.properties?.description) {
    companyDescription = company.properties?.description
  } else if (company.properties?.about_us) {
    companyDescription = company.properties?.about_us
  } else {
    companyDescription = company?.companyNews
  } */

if (company.properties?.about_us) {
    companyDescription = company.properties?.about_us
  } else {
    companyDescription = company?.companyNews
} 


  var dateref;

  if (year === 2023 || 2024) {
    dateref = month + ' ' + year;
  } else {
    dateref = year;
  }

  const messagePrompt = `Given this description of a company: "${companyDescription}"

What are the 3 most important energy reduction challenges that ${companyName} ${website}, a company in the ${industry} industry, would need the assistance of Advantage Utilities (www.advantageutilities.com), an all-in-one energy consultant? For each challenge, can you identify a potential solution that Advantage Utilities can offer? 

Based on the identified problems, challenges and potential solutions, please write two sentences with a maximum of 35 words to insert in a cold outbound email that communicates that I understand ${companyName}'s business, it's main energy cost problem and a suggested solution we can offer them. Here is an example: "I know that navigating (problem) whilst maintaining (challenge) presents significant challenges. At Advantage Utilities, we deliver bespoke strategies to manage your energy expenditure and (benefit from solution).

Return a list of the top 3 problems, a potential solution for each problem, the opening paragraph and a 7 word email subject that would generate the most interest to read the email. Here is an example of the desired output for a different company:

Problem: High Energy Consumption in Food Processing & Cold Storage

Challenge: Producing sweets, snacks, and frozen desserts like kulfi requires significant energy for cooking, refrigeration, and freezing.

Solution: Advantage Utilities can conduct an energy audit to optimize equipment efficiency, implement demand-side response strategies, and recommend tailored energy procurement plans to reduce costs.

Problem: Rising Costs from Peak-Time Energy Usage

Challenge: Operating large-scale cooking and cooling processes during peak hours leads to higher electricity costs.

Solution: We can implement load shifting strategies, on-site energy generation (like solar PV), and smart metering to monitor and adjust energy usage in real-time.

Problem: Sustainability & Compliance with Carbon Reduction Goals

Challenge: Meeting sustainability targets while maintaining cost efficiency is a growing challenge in the food industry.

Solution: Advantage Utilities can help (company name) transition to green energy sources, access sustainability grants, and improve carbon reporting for compliance and brand reputation.

Paragraph: Keeping energy costs low while producing high-quality Indian sweets and frozen desserts is challenging. At Advantage Utilities, we help manufacturers like (company name) cut energy waste in cooking and refrigeration, delivering long-term savings without operational disruption.

Subject: A Smarter, Greener Energy Strategy for (company name)

You must use UK British English grammar and spelling, you must use the headings Background, Paragraph and Subject for each section as per the example, under the Challenge heading please list each of the 3 problems, challenges and solutions identfied, each one listed with a number and in the following format as per the example:
Background:
Problem 1: Rising Costs from Peak-Time Energy Usage
Challenge 1: Operating large-scale cooking and cooling processes during peak hours leads to higher electricity costs.
Solution 1: We can implement load shifting strategies, on-site energy generation (like solar PV), and smart metering to monitor and adjust energy usage in real-time.

Do not add notes or extra characters, do not format the answer.`;

  const response = await connectors.openaiCom.chat({
    model: 'gpt-4o',
     messages: [
      {
        "role": "user",
        "content": `${messagePrompt}`
      }
     ],
     stream: false
   });

  const message = response.choices?.[0]?.message?.content;

//  console.log(message)

  const subjectMatch = message.match(/Subject:\s*(.+)/);
  const paragraphMatch = message.match(/Paragraph:\s*(.+)/);
  const challengesMatch = message.match(/Background:([\s\S]*?)Solution 3: (.+)/);
  
  const subject = subjectMatch ? subjectMatch[1].trim() : "";
  const paragraph = paragraphMatch ? paragraphMatch[1].trim() : "";
  const challenges = challengesMatch ? `Background:\n${challengesMatch[1].trim()}\nSolution 3: ${challengesMatch[2].trim()}` : "";

  const email = `
Hope all is well.<br><br>
  
I am not sure if you remember but we last spoke a while ago in ${dateref} about partnering to reduce your energy costs. ${paragraph}<br><br>
  
I'd love to share insights on how we can help ${companyName} improve its energy efficiency. Would you mind if we set up a 15-20 minute call to get better introduced and run through how it all works? Just reply to this email with a convenient time or use my booking link below to find a time.<br><br>
  
Alternatively, if you can send me your energy contract renewal date, I would be happy to call you and guide you through the energy purchasing landscape at that time.`;
  if (data.console === true) {
    console.log(`Subject for ${companyName}: `, subject)
    console.log(`Email for ${companyName}: `, email)
  };

  company.subject = subject;
  company.email = email
  company.challenges = challenges
}

if (data.googleSheet === false) {
  data.addToHubspot = true;
}
};
