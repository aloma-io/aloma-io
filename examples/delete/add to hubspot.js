/**
 * Step: add to hubspot
 * ID: fk9lhlhl5ib3ad2eedzcydjjy8efus09
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
  "addToHubspot": true
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  let aiPrompts = `AI Gen prompt ${company?.emailData?.['AI gen prompt']} and ${company?.emailData?.['System Prompt']}`
  if (company?.validatedContacts.length === 0) {
    let companyDescription = ''
    if (company?.properties?.about_us) {
      companyDescription = company?.properties?.about_us
    } else {
      companyDescription = company?.companyNews
    }

    //if no validated contacts for a company, then update the field on the Company: "generate_message" to the value "No Valid Emails".
    const updateCompany = await connectors.hubspotCom.request({
      url: `/crm/v3/objects/companies/${company?.id}`,
      options: {
        method: 'PATCH',
        body: JSON.stringify({
          properties: {
            "generate_message": "No Valid Emails",
            "aloma_subject": `${company?.subject}`,
            "ai_prompts_used": aiPrompts,
            "ai_email": `${company?.email}`,
            "aloma_industry": `${company?.industryNews}`,
            "aloma_company": `${company?.companyNews}`,
            "company_description": `${companyDescription}`,
            "aloma_challenge": `${company?.challenges}`,
            "contact_number": `${company?.contactsNumber}`,
            "hs_lead_status": "AI Message Generated",
            "contacts_enriched": "0",
            "no_valid_emails_for_contacts": "Yes",
            "campaign_sequence": `${company?.emailData.Sequence}`
          },
        }),
        headers: {
          "Content-type": "application/json"
        },
      }
    });
    continue
  }
  
  let companyDescription = ''
  if (company?.properties?.about_us) {
    companyDescription = company?.properties?.about_us
  } else {
    companyDescription = company?.companyNews
  }

  let contacts_enriched = 0
  if (company?.validatedContacts.length > 3) {
    contacts_enriched = 3
  } else {
    contacts_enriched = company?.validatedContacts.length
  }

  const updateCompany = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/companies/${company?.id}`,
    options: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          "aloma_subject": `${company?.subject}`,
          "ai_prompts_used": aiPrompts,
          "ai_email": `${company?.email}`,
          "aloma_industry": `${company?.industryNews}`,
          "aloma_company": `${company?.companyNews}`,
          "ai_paragraph": `${company?.paragraph}`,
          "ai_opener": `${company?.sentence}`,
          "generate_message": "Complete",
          "company_description": `${companyDescription}`,
          "aloma_challenge": `${company?.challenges}`,
          "contact_number": `${company?.contactsNumber}`,
          "hs_lead_status": "AI Message Generated",
          "contacts_enriched": `${contacts_enriched}`,
          "campaign_sequence": `${company?.emailData.Sequence}`
        },
      }),
      headers: {
        "Content-type": "application/json"
      },
    }
  });
  const contacts = company?.validatedContacts ?? [];
  for (const contact of contacts) {
    if (!contact?.id) {
      continue
    } else {
      await connectors.hubspotCom.request({
        url: `/crm/v3/objects/contacts/${contact.id}`,
        options: {
          method: 'PATCH',
          body: JSON.stringify({
            properties: {
              "ai_subject": `${company?.subject}`,
              "ai_email1": `${company?.email}`,
              "ai_paragraph": `${company?.paragraph}`,
              "campaign_sequence": `${company?.emailData.Sequence}`
              //"neverbouncevalidationresult": `${contact?.verifyResult}`
            },
          }),
          headers: {
            "Content-type": "application/json"
          },
        }
      });
      console.log(company?.emailData.Sequence)
    }
  }
}

task.complete()
};
