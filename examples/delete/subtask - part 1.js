/**
 * Step: subtask - part 1
 * ID: s0th243tbeexyoz24y6bqk8fza7iyzjp
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
runsubtask: true
};

export const content = async () => {
const contacts = data.company?.contacts?.results ?? [];
let sequenceId = ''
let contactOwner = ''
let idType = ''
if (data.sequenceAdding) {
  sequenceId = '376436967';
  contactOwner = contacts[0]?.properties?.hubspot_owner_id
  idType = 'id'
} else if (data.duxSoup) {
  sequenceId = '388688072';
  contactOwner = '75255876';
  idType = 'userId'
}

const owner = await connectors.hubspotCom.request({
  url: `crm/v3/owners/${contactOwner}?idProperty=${idType}&archived=false`,
  options: {
    method: 'GET'
  }
});

const senderEmail = owner?.email;
const userId = owner?.userId

try {
  const sequence = await connectors.hubspotCom.request({
    url: `/automation/v4/sequences/enrollments?userId=${userId}`,
    options: {
      method: 'POST',
      body: JSON.stringify({
        contactId: contacts[0].id,
        sequenceId: sequenceId,
        senderEmail: senderEmail
      }),
      headers: {
        "Content-type": "application/json"
      }
    }
  });
} catch (error) {
  console.log('Error: ', error);
  try {
    await connectors.fetch({
      url: `https://hooks.slack.com/services/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`,
      options: {
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ text: `${error} -> https://home.aloma.io/automation/workspace/e-dmy7sp4llr7p8ru37y2ltp19mh82wey7/task/${encodeURIComponent(task.id())}?realm=mta6z7txo1d5v0941fxjikgrbsyv94w6` }),
        text: true
      }
    })
  } catch (e) {
    console.log("error when posting to slack: ", e);
  }
}
const updateContact = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/contacts/${contacts[0]?.id}`,
  options: {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        "ai_sequence_enrollment": "true",
      },
    }),
    headers: {
      "Content-type": "application/json"
    },
  }
});

if (contacts.length === 1) {
  task.complete()
} else {
  task.park(30000)
  data.part2 = true
}


};
