/**
 * Step: Add to Sequence - 2
 * ID: o9y2i875e8spfgeko4ulvkllrjc5aej1
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
  "addSeqStep": 2
};

export const content = async () => {
const i = data.index
const contact = data.contacts[i]
const contactOwner = contact.properties?.hubspot_owner_id
const idType = 'id'
try {
  const owner = await connectors.hubspotCom.request({
    url: `crm/v3/owners/${contactOwner}?idProperty=${idType}&archived=false`,
    options: {
      method: 'GET'
    }
  });

  const senderEmail = owner?.email;
  const userId = owner?.userId
  const sequenceId = data.sequenceId ?? contact.properties?.campaign_sequence
  console.log(data.sequenceId ?? contact.properties?.campaign_sequence);
  if (sequenceId) {

    try {
      const sequence = await connectors.hubspotCom.request({
        url: `/automation/v4/sequences/enrollments?userId=${userId}`,
        options: {
          method: 'POST',
          body: JSON.stringify({
            contactId: contact.id,
            sequenceId: sequenceId,
            senderEmail: senderEmail
          }),
          headers: {
            "Content-type": "application/json"
          }
        }
      });
    } catch (error) {
      try {
        console.log('Error: ', error);
        const errorObj = JSON.parse(error);
        if (errorObj && errorObj.message){
          data.contacts[i].error = `${errorObj.message} and so this contact was not added to the sequence`
        } else {
          data.contacts[i].error = `error adding contact to sequence ${error}`
        }
      } catch (e) {  
        console.log('Error 2: ', e);
        data.contacts[i].error = `error adding contact to sequence`
      }
    }
    task.park(30000) // 30 sec
  } else {
    //if not sequenceId
    data.contacts[i].error = `No sequenceId for contact ${contact.id}`
    console.log('error: ',data.contacts[i].error)
  }
} catch (e) {
  data.contacts[i].error = `error getting the owner ${e?.message || e}`
}
data.index = i + 1
data.addSeqStep = 1
step.redo()
};
