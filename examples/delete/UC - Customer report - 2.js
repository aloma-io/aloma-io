/**
 * Step: UC - Customer report - 2
 * ID: ia62z8qsbsccmujmz6qtwblifsng93l1
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
  UCAccountManager: true,
  response: Object,
  readReportStep: 2,
  "uc_access_token": String
};

export const content = async () => {
const url = 'https://api.administrate.online/v1/reporting/status?' + new URLSearchParams({
  requestId: data.response.requestId,
})

const response = connectors.fetch({
  url:url.toString(),
  options: {
    method: "GET",
    headers: {
      Authorization: `Bearer ${data.uc_access_token}`,
      Accept: "application/json",
      "Content-type": "application/json"
    },
    text: true
  }
});

if (response?.status === 200) {
  const parsedBody = JSON.parse(response.body);
  if (parsedBody.status === 'completed') {
    const customers = connectors.fetch({
      url: data.response.reportUrl, bodyOnly: true
    });
    data.customers = customers.items
  } else {
    data.readReportStep = 1
    step.redo()
    data.retry = data.retry + 1
  }
} else {
  task.complete()
}

};
