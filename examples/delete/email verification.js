/**
 * Step: email verification
 * ID: b8eknv9yhuwqpo64i9bwnwpdshdm0vz0
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
  neverBounce: true
};

export const content = async () => {
const neverbounceKey = task.config("NEVERBOUNCE_KEY")
for (const company of data.hubspotCompanies) {
  const contacts = company?.contacts?.results
  
  if (contacts?.length) {
    const verifiedContacts = [];

    for (const contact of contacts) {
      const email = contact.properties?.email;
      const firstName = contact.properties?.firstname;
      const lastName = contact.properties?.lastname;
      if (email) {
        try {
          const verifyResponse = await fetch(`https://api.neverbounce.com/v4/single/check?key=${neverbounceKey}&email=${encodeURIComponent(email)}`, {
            method: 'POST'
          });

          const verifyResult = await verifyResponse.body;
          if (verifyResult.status === 'general_failure') {
            console.log("Error: ", verifyResult.message)
            try {
              await connectors.fetch({
                url: `https://hooks.slack.com/services/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`,
                options: {
                  headers: {
                    'Content-type': 'application/json',
                    Accept: 'application/json'
                  },
                  method: 'POST',
                  body: JSON.stringify({ text: `${verifyResult.message} -> https://home.aloma.io/automation/workspace/e-dmy7sp4llr7p8ru37y2ltp19mh82wey7/task/${encodeURIComponent(task.id())}?realm=mta6z7txo1d5v0941fxjikgrbsyv94w6 ` }),
                  text: true
                }
              })
            } catch (e) {
              console.log("error when posting to slack: ", e);
            }
            task.complete()
          } else {
            contact.verifyResult = verifyResult?.result
            await connectors.hubspotCom.request({
              url: `/crm/v3/objects/contacts/${contact.id}`,
              options: {
                method: 'PATCH',
                body: JSON.stringify({
                  properties: {
                    "neverbouncevalidationresult": `${verifyResult?.result}`
                  },
                }),
                headers: {
                  "Content-type": "application/json"
                },
              }
            });
          }

          if (verifyResult?.status === 'success' && verifyResult?.result === 'valid') {
            verifiedContacts.push({
              ...contact,
              email_verification: verifyResult
            });
          }
        } catch (err) {
          console.error(`Failed to verify email for contact ${firstName} ${lastName}:`, err);
        }
      } else {
        data.emailsVerified = true
      }
    }
    company.validatedContacts = verifiedContacts;
    company.validatedContactCount = company.validatedContacts.length;
  } else {
    console.log(`No contacts for company ${company.properties.name}`)
    company.validatedContacts = [];
  }
}
data.AIEnrich = true
};
