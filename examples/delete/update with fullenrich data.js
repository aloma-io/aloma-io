/**
 * Step: update with fullenrich data
 * ID: ejzhke5uzodstyjw9zbv4ynzpe97apom
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
  checkEnrich: true
};

export const content = async () => {

const contact = data.datas[0]?.contact;
const custom = data.datas[0]?.custom;
const profile = contact?.profile;
const position = profile?.position;
const company = position?.company;
if (data?.hubspotCompany[0]?.properties?.generate_message === "Complete") {
  await connectors.hubspotCom.request({
    url: `/crm/v3/objects/contacts/${data.contact[0].id}`,
    options: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          "ai_subject": `${data?.hubspotCompany[0]?.properties?.aloma_subject}`,
          "ai_email1": `${data?.hubspotCompany[0]?.properties?.ai_email}`,
          "ai_paragraph": `${data?.hubspotCompany[0]?.properties?.ai_paragraph}`,
          "neverbouncevalidationresult": 'valid',
        },
      }),
      headers: {
        "Content-type": "application/json"
      },
    }
  });
}

const contactFields = {
  "email": contact?.most_probable_email,
  "phone": contact?.most_probable_phone,
  "linkedin_url": profile?.linkedin_url,
  "linkedin_summary": profile?.summary,
  "jobtitle": position?.title
};

const companyFields = {
  "website": company?.website,
  "linkedin_company_page": company?.linkedin_url,
  "description": company?.description,
  "city": company?.headquarters?.city,
  "country": company?.headquarters?.country,
  "address": company?.headquarters?.address_line_1,
  "address2": company?.headquarters?.address_line_2,
};

const newContactProperties = {};
const newCompanyProperties = {};
if (data.contact[0].properties.email && contact?.most_probable_email) {
  const emailDomain = data.contact[0].properties.email.split('@')[1]?.toLowerCase();
  const companyEmail = contact?.most_probable_email?.split('@')[1]?.toLowerCase();
  if (emailDomain !== companyEmail) {
    newContactProperties.email = contact?.most_probable_email
    newContactProperties.secondary_email = data?.contact[0]?.properties?.email
  }
}
for (const [field, fallbackValue] of Object.entries(contactFields)) {
  const currentValue = data.contact[0].properties?.[field];

  const isMissing =
    currentValue === undefined ||
    currentValue === null ||
    (typeof currentValue === 'string' && currentValue.trim() === '');

  if (isMissing && fallbackValue) {
    newContactProperties[field] = fallbackValue;
  }
}

for (const [field, fallbackValue] of Object.entries(companyFields)) {
  const currentValue = data?.hubspotCompany[0]?.properties?.[field];

  const isMissing =
    currentValue === undefined ||
    currentValue === null ||
    (typeof currentValue === 'string' && currentValue.trim() === '');

  if (isMissing && fallbackValue) {
    newCompanyProperties[field] = fallbackValue;
  }
}

if (Object.keys(newContactProperties).length > 0) {
  newContactProperties.enrich_contact = "Complete";
} else {
  newContactProperties.enrich_contact = "Not available";
}
console.log("Contact fields to update in HubSpot:", newContactProperties);
try {
  await connectors.hubspotCom.request({
    url: `/crm/v3/objects/contacts/${data.contact[0].id}`,
    options: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: newContactProperties
      }),
      headers: {
        "Content-type": "application/json"
      },
    }
  });  
} catch (error) {
  console.error('Error:', error);
}

const email = contactFields.email === "" ? "Not available" : contactFields.email;
const phone = contactFields.phone === "" ? "Not available" : contactFields.phone;

console.log("Enrichment result:", newContactProperties.enrich_contact);
console.log("Email updated to: ", email);
console.log("Telephone updated to:", phone);

if (Object.keys(newCompanyProperties).length > 0) {
  console.log("Company fields to update in HubSpot:", newCompanyProperties);
  try {
    await connectors.hubspotCom.request({
      url: `/crm/v3/objects/companies/${data.hubspotCompany[0].id}`,
      options: {
        method: 'PATCH',
        body: JSON.stringify({
          properties: newCompanyProperties
        }),
        headers: {
          "Content-type": "application/json"
        },
      }
    }); 
  } catch (error) {
    console.error('Error:', error);
  }
} else {
  console.log("All required company fields are already present.");
}

const noteBody = `
 **Contact Info**
- Name: ${contact?.firstname} ${contact?.lastname}
- Domain: ${contact?.domain}
- Email: ${contact?.most_probable_email} (${contact?.most_probable_email_status})
- Phone: ${contact?.most_probable_phone}

**Emails**
${contact?.emails.map(e => `- ${e?.email} (${e?.status})`).join('\n')}

**Phones**
${contact?.phones.map(p => `- ${p?.number} (${p?.region})`).join('\n')}

**Social Media**
${contact?.social_medias.map(s => `- ${s?.type}: ${s?.url}`).join('\n')}

**LinkedIn Profile**
- Name: ${profile?.firstname} ${profile?.lastname}
- URL: ${profile?.linkedin_url}
- Headline: ${profile?.headline}
- Summary: ${profile?.summary}
- Location: ${profile?.location}
- Premium: ${profile?.premium_account ? 'Yes' : 'No'}

**Current Position**
- Title: ${position?.title}
- Description: ${position?.description}
- Company: ${company?.name}
- Website: ${company?.website}
- Industry: ${company?.industry}
- Type: ${company?.type}
- Location: ${company?.headquarters?.city}, ${company?.headquarters?.country}
- Address: ${company?.headquarters?.address_line_1}
- Founded: ${company?.year_founded}
- Headcount: ${company?.headcount_range} (${company?.headcount})
`;
const note = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/notes`,
  options: {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().getTime(),
        hs_note_body: noteBody,
      },
      associations: [
        {
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 202
            }
          ],
          to: {
            id: `${data.contact[0].id}`
          }
        }
      ]
    })
  }
});
const hubspotTask = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/tasks`,
  options: {
    method: 'POST',
    body: JSON.stringify({
      properties: {
          hs_timestamp: new Date().getTime(),
        hs_task_subject: `${contact?.firstname} ${contact?.lastname} contact record enrichment complete`,
        hs_task_status: "NOT_STARTED",
        hs_task_priority: "LOW",
        //hs_task_body: "Contact enrichment complete",
        hs_task_type: "TODO"
        },
      associations: [
        {
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 204
            }
          ],
          to: {
            id: `${data.contact[0].id}`
          }
        }
      ]
    })
  }
});
task.complete()
};
