/**
 * Step: reply with joke
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
  from: {
    value: [{
        address: String
      }]
  },
  joke: String,
  subject: String
};

export const content = async () => {
const ret = await connectors.eMailSmtpOAuth.sendEmail
    ({
        subject: `Re: ${data.subject}`,
        text: data.joke,
        to: data.from.value.map((item) => item.address),
        inReplyTo: data.messageId,
        replyTo: 'hello@aloma.io'
})

task.complete();
};
