/**
 * Step: UC - get deal associated contact
 * ID: qbcnvdc0fkvmzp0cex0dmblrz3504p8e
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
    }],
  getDealCustomer: true
};

export const content = async () => {
const dealID = data.items[0].objectId;;

const associatedContacts = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/deals/${dealID}/associations/contacts`,
  options: {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    },
  }
});

const contactIds = associatedContacts?.results?.map(contact => contact.id) || [];

if (contactIds.length > 0) {

  const properties = 'properties=firstname,lastname,phone'
  const hubspotContact =  await connectors.hubspotCom.request({
      url: `/crm/v3/objects/contacts/${contactIds[0]}?${properties}`,
    options: {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      },
    }
  })

  data.contact = hubspotContact
  data.getUCToken = true
} else {
  data.sendDealAssociationError = true
}

};
