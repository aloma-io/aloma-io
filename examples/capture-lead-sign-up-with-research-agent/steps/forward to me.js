/**
 * Step: forward to me
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
  attachments: Array,
  textAsHtml: String,
  subject: String,
};

export const content = async () => {
  await connectors.eMailSmtpOAuth.sendEmail({
    to: ['me@test.com'],
    subject: data.subject,
    attachments: data.attachments,
    text: data.text,
  });
  task.completeOnExpire();
};
