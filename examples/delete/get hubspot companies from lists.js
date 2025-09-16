/**
 * Step: get hubspot companies from lists
 * ID: uo6rfl1ec0p8k69a2t16qtegx2t8ucod
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
if (data.$via.name === "googleSheet") {
  task.name("Production Run from Google Sheet")
}

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
  const listIds = task.config("HUBSPOT_LIST_IDS")
  const listIdsArray = listIds.split(",")
  const companyIds = []
  const limit = Math.floor(data.limitCompanies / listIdsArray.length);
  for (const listId of listIdsArray) {
    const list = await connectors.hubspotCom.request({
      url: `/crm/v3/lists/${listId}/memberships?limit=${limit}`,
      options: {
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        }
      }
    });

    companyIds.push(...list.results.map(result => result.recordId))
  }

  console.log("companyIds: ", companyIds)

  if (companyIds.length === 0) {
    console.log("No companies found. Ending task.");
    task.complete();
  }
  body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_object_id",
              operator: "IN",
              values: companyIds
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


if (hubspotCompanies.total === 0 || hubspotCompanies.results.length === 0) {
  console.log("No companies found. Ending task.");
  task.complete();
}

data.hubspotCompanies = hubspotCompanies.results
data.filterProps = true
};
