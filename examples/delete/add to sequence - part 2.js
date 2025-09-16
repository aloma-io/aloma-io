/**
 * Step: add to sequence - part 2
 * ID: dnrc8drl4y4ji8f0zp6y2r12w0kt18l3
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
  addToSequence: true,
  nextStep: 2
};

export const content = async () => {
const companies = data.hubspotCompanies;
const batchSize = 1;
const initialIndex = data.index
const batch = companies.slice(initialIndex, initialIndex + batchSize);

for (let i = 0; i < batch.length; i++) {
  const contacts = batch[0]?.contacts?.results ?? [];
  if (contacts.length > 0) {
    if (data.sequenceAdding) {
      const name = `subtask for ${batch[0]?.properties?.name}`
      task.subtask(name, { company: batch[0], runsubtask: true, sequenceAdding: true}, { into: `company.response`, waitFor: true })
    } else if (data.duxSoup) {
      const name = `subtask for ${batch[0]?.properties?.name}`
      task.subtask(name, { company: batch[0], runsubtask: true, duxSoup: true}, { into: `company.response`, waitFor: true })
    }
  }

  const updateCompany = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/companies/${batch[0]?.id}`,
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
}
data.index = initialIndex + batchSize
data.nextStep = 1
step.redo()
};
