/**
 * Step: send FullEnrich request
 * ID: i5c6qz9umczyd60gga3ss4yn1gjf7pw8
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
  fullEnrich: true
};

export const content = async () => {
const apiKey = task.config("FULLENRICH_KEY")
for (const company of data.hubspotCompanies) {
  const creditOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  };
  const creditCheck = await connectors.fetch({ url: 'https://app.fullenrich.com/api/v1/account/credits', options: creditOptions })
  //console.log("FullEnrich credits: ", creditCheck.body.balance)
  if (creditCheck.body.balance < 1) {
    console.log("Insufficient credits for enrichment")
    break
  }
  if (!company?.contacts?.results) continue;
  const contacts = company?.contacts?.results
  for (const contact of contacts) {
    if (!contact?.properties?.firstname || !contact?.properties?.lastname || !company?.properties?.domain || contact?.properties?.enrich_contact === "Complete" || contact?.properties?.enrich_contact === "Yes") continue;
    if (!contact?.properties?.email || contact?.verifyResult !== "valid") {
      if (!contact?.properties?.linkedin_url) {
        try {
          const options = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: `{"webhook_url":"https://connect.aloma.io/event/zzbhuyey8aab7v7abrwsriwh5rzggiqnLA2MQ5TH","name":"Get Email","datas":[{"firstname":"${contact?.properties?.firstname}","lastname":"${contact?.properties?.lastname}","domain":"${company?.properties?.domain}","company_name":"${company?.properties?.name}","enrich_fields":["contact.emails"],"custom":{"user_id":"${contact?.id}"}}]}`
          };

          const enrich = connectors.fetch({ url: 'https://app.fullenrich.com/api/v1/contact/enrich/bulk', options: options })
        } catch (error) {
        console.log('Error:', error);
        }
      } else {
        try {
          const options = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: `{
                  "webhook_url":"https://connect.aloma.io/event/zzbhuyey8aab7v7abrwsriwh5rzggiqnLA2MQ5TH",
                  "name":"Get Email",
                  "datas":[{
                    "firstname":"${contact?.properties?.firstname}",
                    "lastname":"${contact?.properties?.lastname}",
                    "domain":"${company?.properties?.domain}",
                    "company_name":"${company?.properties?.name}",
                    "linkedin_url":"${contact?.properties?.linkedin_url}",
                    "enrich_fields":[
                      "contact.emails"
                    ],
                    "custom":{
                      "user_id":"${contact?.id}"
                      }
                  }]
                }`
          };

          const enrich = connectors.fetch({ url: 'https://app.fullenrich.com/api/v1/contact/enrich/bulk', options: options })

        } catch (error) {
          console.log('Error:', error);
        }
      }
    } else {
      continue
    }
  }
}
if (data.production) {
  data.AIEnrich = true
} else if (data.duxSoup) {
  data.addToSequence = true
  data.index = 0;
  data.nextStep = 1
}

};
