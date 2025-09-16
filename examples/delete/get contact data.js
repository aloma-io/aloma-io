/**
 * Step: get contact data
 * ID: la3yv71jhmvv1mp948rum54xbayt37mo
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
      subscriptionType: "contact.propertyChange",
      propertyName: "enrich_contact"
    }]
};

export const content = async () => {
task.name('Enriching Contact')
if (data.items[0].subscriptionType !== "contact.propertyChange" && data.items[0].propertyName !== "enrich_contact") {
  task.ignore()
}
const contactId = data.items[0].objectId;
const request = data.items[0].propertyValue;
if (request !== "Yes") {
  task.ignore()
}

const body = {
  filterGroups: [
    {
      filters: [
        {
          propertyName: "hs_object_id",
          operator: "EQ",
          value: `${contactId}`
        }
      ]
    }
  ],
  properties: ["firstname", "lastname", "linkedin_url"]
};

const hubspotContact = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/contacts/search`,
  options: {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: body
  }
})
data.contact = hubspotContact.results
const associatedCompanies = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/contacts/${contactId}/associations/companies`,
    options: {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      },
    }
  });

const companyIds = associatedCompanies.results?.map(company => company.id) || [];

const companiesData = companyIds.length > 0
    ? await connectors.hubspotCom.request({
      url: `/crm/v3/objects/companies/batch/read`,
      options: {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          properties: ["domain", "name", "email"],
          inputs: companyIds.map(id => ({ id }))
        })
      }
    })
  : null;

if (companiesData) {
  companiesData.results = companiesData.results.filter(company => {
    return !company.properties?.do_not_contact;
  });
}

data.company = companiesData
data.enrichContact = true
};
