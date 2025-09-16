/**
 * Step: get hubspot companies
 * ID: fcbrakvets3i1po1t7tey22ppkv2ueei
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
getCompanies: true
};

export const content = async () => {
const companyProperties = await connectors.hubspotCom.request({
  url: `/crm/v3/properties/companies`,
  options: {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  }
});

const allProperties = companyProperties.results.map(prop => prop.name);

let body;
if (data.sequenceAdding) {
  body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "generate_message",
            operator: "EQ",
            value: "Complete"
          },
          {
            propertyName: "hubspot_owner_id",
            operator: "HAS_PROPERTY",
          },
          {
            propertyName: "hs_lead_status",
            operator: "EQ",
            value: "AI Message Generated"
          },
          {
            propertyName: "ai_paragraph",
            operator: "HAS_PROPERTY",
          },
          {
            propertyName: "ai_email_approval",
            operator: "NEQ",
            value: "No"
          },
          // {
          //   propertyName: "hs_last_logged_call_date",
          //   operator: "NOT_HAS_PROPERTY",
          // },
          {
            propertyName: "ai_sequence_enrollment",
            operator: "NEQ",
            value: "true"
          },
        ]
      }
    ],
    limit: 5,
    properties: allProperties
  };
} else if (data.production) {
  body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "type",
            operator: "NEQ",
            value: "Test"
          },
          {
            propertyName: "generate_message",
            operator: "EQ",
            value: "Ready"
          },
          {
            propertyName: "hs_lead_status",
            operator: "EQ",
            value: "NEW"
          },
          {
            propertyName: "industry",
            operator: "HAS_PROPERTY",
          },
          {
            propertyName: "hubspot_owner_id",
            operator: "EQ",
            value: "1299209607"
          },
          {
            propertyName: "do_not_contact",
            operator: "NOT_HAS_PROPERTY",
          }
        ]
      },
      {
        filters: [
          {
            propertyName: "type",
            operator: "NEQ",
            value: "Test"
          },
          {
            propertyName: "generate_message",
            operator: "EQ",
            value: "Ready"
          },
          {
            propertyName: "hs_lead_status",
            operator: "EQ",
            value: "NEW"
          },
          {
            propertyName: "hs_industry_group",
            operator: "HAS_PROPERTY",
          },
          {
          propertyName: "hubspot_owner_id",
            operator: "EQ",
            value: "1299209607"
          },
          {
            propertyName: "do_not_contact",
            operator: "NOT_HAS_PROPERTY",
          }
        ]
      }
    ],
    limit: data.limitCompanies,
    properties: allProperties
  };
}

const hubspotCompanies = await connectors.hubspotCom.request({
  url: `/crm/v3/objects/companies/search`,
  options: {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: body
  }
})

/*if (data.production && hubspotCompanies.results.length < body.limit) {
  connectors.eMailSmtp.send({
    from: "noreply@aloma.io",
    to: "Sam.l@advantageutilities.com",
    subject: `AI enrichment for companies not completed`,
    html: `
      <p>Sam,</p>

      <p>this is a friendly email from Aloma to let you know that we could not complete the AI enrichment for ${body.limit} companies. We were only able to process ${hubspotCompanies.results.length} companies </p>

      <p>Please add more companies (Lead Status - New, Generate AI Message - Generate, Industry or Industry Group specified) and they will be automatically processed the next night.</p>
      
      <p>Yours truly, <br>
      Aloma team</p>
    `
  });
} */

if (hubspotCompanies.total === 0 || hubspotCompanies.results.length === 0) {
  console.log("No companies found. Ending task.");
  task.complete();
}

data.hubspotCompanies = hubspotCompanies.results
data.filterProps = true
};
