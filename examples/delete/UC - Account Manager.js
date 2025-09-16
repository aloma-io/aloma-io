/**
 * Step: UC - Account Manager
 * ID: yh89xpu4p0sozqrzhhowzdtat8baekl5
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
UCAccountManager:true,
uc_access_token:String
};

export const content = async () => {
const today = new Date();
today.setDate(today.getDate() - 1);

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const yesterdayFormatted = `${year}/${month}/${day}`; //YYYY/MM/DD format, e.g., "2025/07/01"

const url = 'https://api.administrate.online/v1/reporting/customers/initiate?' + new URLSearchParams({
  LastUpdated: yesterdayFormatted,
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
  data.response = parsedBody
  data.readReportStep = 1
} else {
  task.complete()
}
};
