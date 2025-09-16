/**
 * Step: Send Deal Association Error
 * ID: z470jxu5z4jvs74331q6fr3omza4hv8p
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
sendDealAssociationError : true
}
;

export const content = async () => {
const message = 'No contact/Company for this deal, please add and then change deal out of LOA and then back in again to retrigger that automation.'
const dealID = data.items[0].objectId;

connectors.eMailSmtpOAuth.sendEmail({
  to: ["juan@aloma.io"],
  subject: `No contact/Company for deal ${dealID}`,
  html: `<p> ${message} <\p>
  <p> Deal url: https://app-eu1.hubspot.com/contacts/145183147/record/0-3/${dealID}<\p>`,
});

task.complete()
};
