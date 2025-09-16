/**
 * Step: UC - create customer 
 * ID: f07kp80rzqzif839l9ju03tkzbqon93r
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
  UCCreateCustomer: true,
  "uc_access_token": String
};

export const content = async () => {
const companyData = data.company.properties;
const contactData = data.contact.properties;

const queryParams = new URLSearchParams({
  IsLead: false,
  CustomerName: `${companyData.name}`,
  RegisteredAddressLine1: `${companyData.address}`,
  RegisteredAddressLine2: `${companyData.address2}`,
  RegisteredAddressLine3: `${companyData.country}`,
  RegisteredAddressLine4: `${companyData.city}`,
  Postcode: `${companyData.zip}`,
  OptInUrl: `${companyData.domain}`,
  OptInDate: new Date().toISOString(),
  "PrimaryContact.FirstName": contactData.firstname,
  "PrimaryContact.LastName": contactData.lastname,
  "PrimaryContact.PhoneNumber": contactData.phone
})
// Add this line conditionally
if (companyData.supplier) {
  queryParams.append('CurrentPartnerSupplier', companyData.supplier);
}

const queryString = queryParams.toString();

console.log('QueryParams: ', queryParams)
const response = connectors.fetch({
  url: `https://api.administrate.online/v1/customers?${queryString}`,
  options: {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.uc_access_token}`,
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: '', // no body required
    text: true
  }
});

console.log(response)

if (response?.status === 201) {
  const parsedBody = JSON.parse(response.body);
  const id = parsedBody.id;
  const updateCompany = await connectors.hubspotCom.request({
    url: `/crm/v3/objects/companies/${data.company.id}`,
    options: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          "uc_customer_id": `${id}`,
        },
      }),
      headers: {
        "Content-type": "application/json"
      },
    }
  });
  console.log(updateCompany)
} else {
  console.log(' No uc_customer_id')
}
task.complete()
};
