/**
 * Step: on chuck norris email
 * ID: lwevyp8y48j0o5fysf9wh3f7ocdu2mk0
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
  subject: /.*chuck +norris.*/i
};

export const content = async () => {
task.name('Chuck Norris joke request');
task.tags(['chuck', 'norris', 'joke'])
const joke = await connectors.fetch({ url: 'https://api.chucknorris.io/jokes/random', bodyOnly: true });

data.joke = joke.value
};
