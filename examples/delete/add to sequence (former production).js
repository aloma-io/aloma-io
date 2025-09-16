/**
 * Step: add to sequence (former production)
 * ID: ucj9ginxy8zq8qyadhgmbbmg4z4cwlpk
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
  "production": false,
  "sequenceAdding": false
};

export const content = async () => {
const companies = data.hubspotCompanies;

for (const company of companies) {
  if (company?.validatedContacts.length === 0) {
    continue
  }
  const contacts = company?.validatedContacts ?? [];
  let enrolledCount = 0
  for (const contact of contacts) {
    if (enrolledCount >= 3) break;
    if (!contact?.id || !contact?.properties?.email || !contact?.properties?.hubspot_owner_id) {
      continue
    } else {
      const contactOwner = contact?.properties?.hubspot_owner_id
      const owner = await connectors.hubspotCom.request({
        url: `/crm/v3/owners/${contactOwner}?idProperty=id&archived=false`,
        options: {
          method: 'GET'
        }
      });

      const sequenceId = '376436967';
      const senderEmail = owner?.email;
      const userId = owner?.userId
      if (userId !== 75255991) {
        continue
      }
      try {
        // const sequence = await connectors.hubspotCom.request({
        //   url: `/automation/v4/sequences/enrollments?userId=${userId}`,
        //   options: {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       contactId: contact.id,
        //       sequenceId: sequenceId,
        //       senderEmail: senderEmail
        //     }),
        //     headers: {
        //       "Content-type": "application/json"
        //     }
        //   }
        // });
        enrolledCount++
      } catch (error) {
        console.error(`Failed to enroll contact ${contact?.properties?.firstname} ${contact?.properties?.lastname} in sequence: `, error);
        // connectors.slackCom.send({
        //   text: `Failed to enroll contact ${contact?.properties?.firstname} ${contact?.properties?.lastname} in sequence: ${error}`,
        //   channel: 'C08KQAS2L9Y'
        // });
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
        continue
      }
    }
  }
}
task.complete()
};
