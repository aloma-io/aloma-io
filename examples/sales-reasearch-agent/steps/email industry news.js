/**
 * Step: email industry news
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
sendEmail: true
};

export const content = async () => {
const fileLink = `https://drive.google.com/file/d/${data.fileID}/view?usp=sharing`;

const email = await connectors.eMailSmtpOAuth.sendEmail({
  to: 'test@test.io',
  subject: 'Testing Industry News Output',
  html: `
  <p>Hello,</p>
  <p>I am testing the following Industry News Output.</p>
  <pre>${fileLink}</pre>
`
});
task.complete()
};
