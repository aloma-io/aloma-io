/**
 * Step: UC - get deal and company
 * ID: ijgygrdqvf6q6d2ogs0qzoowf8gmnkug
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
      subscriptionType: "deal.propertyChange",
      propertyName: "loa_received_"
    }]
};

export const content = async () => {
if (data.items[0].subscriptionType !== "deal.propertyChange" || data.items[0].propertyName !== "loa_received_") {
  task.ignore()
}
task.name("Hubspot LOA received - create customer UC")

const dealID = data.items[0].objectId;

const associatedCompanies = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/deals/${dealID}/associations/companies`,
  options: {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    },
  }
});

const companyIds = associatedCompanies.results?.map(company => company.id) || [];
const properties = 'properties=domain,name,email,address,address2,zip,uc_customer_id,supplier,city,country'
if (companyIds.length > 0) {
  const companyData = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/companies/${companyIds[0]}?${properties}`,
    options: {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      },
    }
  })

  if (companyData.properties.uc_customer_id) {
    console.log(`Company ${companyData.properties.name} has uc_customer_id ${companyData.properties.uc_customer_id}`)
    task.complete()
  }
  data.company = companyData
  data.getDealCustomer = true
  data.UCCreateCustomer = true
  data.scope = 'customers'
} else {
  data.sendDealAssociationError = true
}


};
