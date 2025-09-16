/**
 * Step: enrich contact
 * ID: qts7spjq2fbs41ed0w7ys70ogp4q1c1c
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
enrichContact: true
};

export const content = async () => {
const apiKey = task.config("FULLENRICH_KEY")
const firstName = data?.contact[0]?.properties?.firstname;
const lastName = data?.contact[0]?.properties?.lastname;
const linkedinURL = data?.contact[0]?.properties?.linkedin_url;
const id = data?.contact[0]?.id
if (!firstName || !lastName || !data?.company || !data?.company?.results) {
  task.ignore()
} else {
  for (const company of data?.company?.results) {
    const name = company?.properties?.name;
    const domain = company?.properties?.domain;
    if (!name || !domain) {
      task.ignore()
    };
    if (!linkedinURL) {
      try {
        const options = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: `{"webhook_url":"https://connect.aloma.io/event/zzbhuyey8aab7v7abrwsriwh5rzggiqnLA2MQ5TH","name":"Get Email","datas":[{"firstname":"${firstName}","lastname":"${lastName}","domain":"${domain}","company_name":"${name}","enrich_fields":["contact.emails","contact.phones"],"custom":{"user_id":"${id}"}}]}`
    };

        const enrich = connectors.fetch({ url: 'https://app.fullenrich.com/api/v1/contact/enrich/bulk', options: options })
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        const options = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: `{
                "webhook_url":"https://connect.aloma.io/event/zzbhuyey8aab7v7abrwsriwh5rzggiqnLA2MQ5TH",
                "name":"Get Email",
                "datas":[{
                  "firstname":"${firstName}",
                  "lastname":"${lastName}",
                  "domain":"${domain}",
                  "company_name":"${name}",
                  "linkedin_url":"${linkedinURL}",
                  "enrich_fields":[
                    "contact.emails",
                    "contact.phones"
                  ],
                  "custom":{
                    "user_id":"${id}"
                    }
                }]
              }`
        };

        const enrich = connectors.fetch({ url: 'https://app.fullenrich.com/api/v1/contact/enrich/bulk', options: options })

      } catch (error) {
        console.error('Error:', error);
      }
    }    
  }
}

//task.complete()
};
