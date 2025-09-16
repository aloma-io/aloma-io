/**
 * Step: Read contacts from list
 * ID: ix73ivybz8tawy0m0hps3v68qp14stwu
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
  "addToSequence": true,
  "testing": false
};

export const content = async () => {
let getNextPage = true
let after
const contactsWithData = []
while (getNextPage) {
  const listMembers = await connectors.hubspotCom.request({
    url: `/crm/v3/lists/790/memberships${after ? `?after=${after}` : ''}`,
    options: {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      }
    }
  });

  const ids = listMembers.results?.map(member => ( { id: member.recordId } ))
  const contactsData = ids.length > 0
    ? await connectors.hubspotCom.request({
      url: `/crm/v3/objects/contacts/batch/read`,
      options: {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          properties: ["campaign_sequence", "hubspot_owner_id"],
          inputs: ids
        })
      }
    })
    : null;
    
  if (contactsData) {
    contactsWithData.push(...contactsData.results)
  }

 if (listMembers.paging && listMembers.paging.next?.after) {
    after = listMembers.paging.next.after
  } else {
    getNextPage = false
  }
}
data.contacts = contactsWithData
data.addSeqStep = 1
data.index = 0
};
