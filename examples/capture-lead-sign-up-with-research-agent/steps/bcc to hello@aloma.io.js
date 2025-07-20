/**
 * Step: bcc to hello@aloma.io
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
  title: String,
  content: String,
  url: String,
  user: Object,
  realm: Object,
  bccToHello: null
};

export const content = async () => {
task.completeOnExpire()

const user = data.user;
const realm = data.realm;

const subject = `Feedback from ${user.firstName} ${user.lastName}`
const message = `${subject} at ${realm.name}

${data.content}

----
at: ${data.url}
userId: ${user.id}
realmId: ${realm.id}
`

const sent = await connectors.eMailSmtpOAuth.sendEmail
({
    to: ['test@test.com'],
    subject,
    text: message,
    attachments: [
        { name: 'screenshot.jpg', content: data.image }
    ]
});

data.bccToHello = sent;

};
