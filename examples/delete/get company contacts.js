/**
 * Step: get company contacts
 * ID: dew95lbtvumxpnmwz2lwrwe6k5almfnm
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
  hubspotCompanies: Array,
  getContacts: true
};

export const content = async () => {
for (const company of data.hubspotCompanies) {
  const companyId = company.id;

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

  const contactsData = contactIds.length > 0
    ? await connectors.hubspotCom.request({
      url: `/crm/v3/objects/contacts/batch/read`,
      options: {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          properties: ["firstname", "lastname", "email", "phone", "linkedin_url","hubspot_owner_id", "do_not_contact", "neverbouncevalidationresult", "ai_sequence_enrollment"],
          inputs: contactIds.map(id => ({ id }))
        })
      }
    })
    : null;
  if (contactsData) {
    contactsData.results = contactsData.results.filter(contact => {
      return !contact.properties?.do_not_contact && contact.properties?.email;
    });
    if (data.sequenceAdding) {
      contactsData.results = contactsData.results.filter(contact => {
        const props = contact?.properties || {};
        return (
          props.neverbouncevalidationresult === "Valid"
          //&& props.ai_sequence_enrollment !== "true"
        );
      });
    }
    if (contactsData.results.length > 3) {
      contactsData.results = contactsData.results.slice(0,3)
    }
  }
  

  company.contacts = contactsData;
  company.contactsNumber = company?.properties?.num_associated_contacts
  if (!contactsData) {
    company.contactsNumber = 0
  }
}
if (data.production) {
  data.neverBounce = true
} else if (data.sequenceAdding) {
  data.addToSequence = true
  data.index = 0;
  data.nextStep = 1
}
};
