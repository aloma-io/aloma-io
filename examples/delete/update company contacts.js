/**
 * Step: update company contacts
 * ID: q9lf1vhvee9xibaeu884gfsc9mp9cwlz
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
  contacts: Object,
  email: String,
  update: true
};

export const content = async () => {
const contacts = data?.contacts?.results ?? [];
for (const contact of contacts) {
  if (!contact?.id) continue
  await connectors.hubspotCom.request({
    url: `/crm/v3/objects/contacts/${contact?.id}`,
    options: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          "ai_paragraph": `${data?.email}`,
        },
      }),
      headers: {
        "Content-type": "application/json"
      },
    }
  })
};
task.complete()
};
