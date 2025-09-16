/**
 * Step: get changed field value
 * ID: y9uhufn9ig5hnrqu36tnrgjmxb80mzhm
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
  "$via": {
    name: "hubspot"
  },
  items: [{
      subscriptionType: "company.propertyChange",
      propertyName: "ai_paragraph"
    }]
};

export const content = async () => {
task.name('Updating AI Email')
if (data.items[0].subscriptionType !== "company.propertyChange" && data.items[0].propertyName !== "ai_paragraph") {
  task.ignore()
}
const companyId = data.items[0].objectId;
const email = data.items[0].propertyValue;
const time = data.items[0].occurredAt;

function isWithinRestrictedHours(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const day = date.getUTCDay();

  const restrictedStart = 0 * 60 + 55;
  const restrictedEnd = 5 * 60 + 30;
  const currentMinutes = hours * 60 + minutes;

  return (day >= 1 && day <= 5) && (currentMinutes >= restrictedStart && currentMinutes < restrictedEnd);
}

if (isWithinRestrictedHours(time)) {
  task.ignore()
} else {
  const associateContacts = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/companies/${companyId}/associations/contacts`,
    options: {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      },
    }
  });

  const contactIds = associateContacts?.results?.map(contact => contact.id) || [];

  let contactsData = { results: [] };

  if (contactIds.length > 0) {
    for (let i = 0; i < contactIds.length; i += 100) {
      const chunk = contactIds.slice(i, i + 100);

      const response = await connectors.hubspotCom.request({
        url: `/crm/v3/objects/contacts/batch/read`,
        options: {
          method: 'POST',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            properties: ["firstname", "lastname", "email", "phone"],
            inputs: chunk.map(id => ({ id }))
          })
        }
      });

      if (response?.results?.length) {
        contactsData.results.push(...response.results);
      }
    }
  }
  data.contacts = contactsData;
  data.email = email
  data.update = true
}
};
