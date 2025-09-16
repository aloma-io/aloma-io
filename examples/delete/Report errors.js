/**
 * Step: Report errors
 * ID: v88jkm786mwjqj1d2imwrsxtmt5v17xt
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
  "reportErrors": true
};

export const content = async () => {
const contactErrors = data.contacts.filter(contact => !!contact.error)

if (contactErrors.length > 0) {
  const slackMessage = `there are contacts with errors -> https://home.aloma.io/automation/workspace/e-dmy7sp4llr7p8ru37y2ltp19mh82wey7/task/${encodeURIComponent(task.id())}?realm=mta6z7txo1d5v0941fxjikgrbsyv94w6`
  connectors.slackCom.send({ text: slackMessage, channel: 'C0916F4R9BQ' })
  console.log('Errors:')
  console.log(contactErrors)
  
/*  const message = contactErrors
    .map(contact => {
      const url = `https://app-eu1.hubspot.com/contacts/145183147/record/0-1/${contact.id}`;
      return `<p>For contact <a href="${url}" target="_blank">${url}</a>, ${contact.error}</p>`;
    })
    .join('\n');
    connectors.eMailSmtp.send({
      from: "noreply@aloma.io",
      to: "sam.l@advantageutilities.com",
      cc: "support@aloma.io",
      subject: `Adding to Sequence errors`,
      html: `
      <p>Hello Sam,</p>

      <p>These are the errors from adding to Sequence:</p>

      ${message}

      <p>Feel free to reach out to us for further assistance.</p>
      
      <p>Aloma team</p>
    `
    }); */
} 
task.complete()
};
