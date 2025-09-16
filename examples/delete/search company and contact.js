/**
 * Step: search company and contact
 * ID: xadwnfiv9pmo8atard0qfkmdyx8udffl
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
    name: "full-enrich"
  }
};

export const content = async () => {
const contact = data?.datas[0]?.contact
task.name(`FullEnrich Data for ${contact.firstname} ${contact.lastname}`)
const contactId = data?.datas[0]?.custom?.user_id
const companyProperties = await connectors.hubspotCom.request({
  url: `/crm/v3/properties/companies`,
  options: {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  }
});

const allCompanyProperties = companyProperties.results.map(prop => prop.name);

const body1 = {
  filterGroups: [
    {
      filters: [
        {
          propertyName: "domain",
          operator: "EQ",
          value: `${contact?.domain}`
        }
      ]
    }
  ],
  limit: 1,
  properties: allCompanyProperties
};

const hubspotCompany = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/companies/search`,
  options: {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: body1
  }
})
data.hubspotCompany = hubspotCompany.results
const companyId = hubspotCompany.results.id;

const contactProperties = await connectors.hubspotCom.request({
  url: `/crm/v3/properties/contacts`,
  options: {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  }
});

const allContactProperties = contactProperties.results.map(prop => prop.name);

const body2 = {
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
  limit: 1,
  properties: allContactProperties
};

const hubspotContact = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/contacts/search`,
  options: {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: body2
  }
})

data.contact = hubspotContact.results
data.checkEnrich = true
};
