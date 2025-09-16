/**
 * Step: UC - update hubspot contacts
 * ID: kfkd7pngkhc7452pgjscj6p33rp2tqz1
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
  UCAccountManager: true,
  customers: Object
};

export const content = async () => {
const customers = data.customers

// Split into chunks of 100 for the search API
const chunkSize = 100;
const chunks = [];
for (let i = 0; i < customers.length; i += chunkSize) {
  chunks.push(customers.slice(i, i + chunkSize));
}
const updates = [];

for (const chunk of chunks) {
  const ucIds = chunk.map(customer => customer.id);
  // Search request payload
  const searchPayload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'uc_customer_id',
            operator: 'IN',
            values: ucIds
          }
        ]
      }
    ],
    properties: ['uc_customer_id'],
    limit: 100
  };

  // Perform the search
  const hubspotContacts = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/contacts/search`,
    options: {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: searchPayload
    }
  })
  if (hubspotContacts.total === 0 || hubspotContacts.results.length === 0) {
    console.error('No contacts found in the chunk');
    continue;
  }

  const foundContacts = hubspotContacts.results;

  for (const contact of foundContacts) {
    const ucCustomerId = contact.properties.uc_customer_id;
    const hubspotId = contact.id;

    const item = chunk.find(i => i.id === ucCustomerId);
    if (!item) continue;
    console.log('Hubspot ID ', hubspotId, 'ucCustomerId', ucCustomerId);
    
    updates.push({
      id: hubspotId,
      properties: {
        do_not_contact: item.accountManager,
        // uc_opt_in_url: hubspotId
      }
    });
  }
}

// Chunk updates (HubSpot allows up to 100 per batch update)
const updateChunks = [];
for (let i = 0; i < updates.length; i += chunkSize) {
  updateChunks.push(updates.slice(i, i + chunkSize));
}
console.log('contacts updated ', updates.length)
for (const chunk of updateChunks) {
  console.log('update chunk ', chunk)
  const updatePayload = { inputs: chunk };
  try {
    const response  = await connectors.hubspotCom.request({
      url: `/crm/v3/objects/contacts/batch/update`,
      options: {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(updatePayload)
      }
    })

  } catch (error) {
    console.log('error ', error)
  }
}
task.complete()
};
