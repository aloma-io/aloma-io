/**
 * Step: check existence in hubspot
 * ID: dw2j2m3k9fs5rf78mfjj57eqctf8vl21
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
checkHubspot: true
};

export const content = async () => {
const companyWebsite = data?.data?.CompanyWebsite;
if (!companyWebsite) {
  console.log("no website to do check")
  data.hubspotCompanies = data.company
} else {
  const domainOnly = companyWebsite
    ?.replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  const firstname = data?.data?.["First Name"];
  const lastname = data?.data?.["Last Name"];

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

  const companySearchResponse = await connectors.hubspotCom.request({
    url: "/crm/v3/objects/companies/search",
    options: {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "domain",
                operator: "EQ",
                value: `${domainOnly}`,
              }
            ]
          }
        ],
        limit: 1,
        properties: allProperties,
      }
    }
  });

  let companyId;
  if (companySearchResponse?.results?.length > 0) {
    //companyId = companySearchResponse.results[0].id;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const filteredCompanies = companySearchResponse.results.map(company => {
      const filteredProperties = { ...company.properties };
      if (filteredProperties.uc_last_contact_date) {
        const [year, month, day] = filteredProperties.uc_last_contact_date.split('-');
        filteredProperties.month = monthNames[parseInt(month, 10) - 1];
        filteredProperties.year = year;
      } else {
        filteredProperties.ucDate = false
      }
      filteredProperties.name = filteredProperties.name.replace(/\b(LLP|INC|LTD|LIMITED|COMPANY)\b/gi, '').trim();
      if (filteredProperties.name && /^[A-Z\s]+$/.test(filteredProperties.name)) {
        filteredProperties.name = filteredProperties.name
          .toLowerCase()
          .replace(/\b\w/g, char => char.toUpperCase())
          .trim();
      }
      if (filteredProperties.industry) {
      filteredProperties.industry = filteredProperties.industry
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/^(\w)/, char => char.toUpperCase());
      }
      return {
        id: company.id,
        properties: filteredProperties
      };
    });
    data.hubspotCompanies = filteredCompanies
    data.existingCompany = true

    const companyId = companySearchResponse.results[0].id;
  
    const contactProperties = await connectors.hubspotCom.request({
      url: `/crm/v3/properties/contacts`,
      options: {
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        }
      }
    });

    const allContactProperties = contactProperties.results.map(prop => prop.name);
    const associateContacts = await connectors.hubspotCom.request({
      url: `/crm/v3/objects/companies/${companyId}/associations/contacts`,
      options: {
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        },
      }
    });

    const contactIds = associateContacts?.results?.map(contact => contact.id) || [];

    if (contactIds.length > 0) {
      const contactsData = await connectors.hubspotCom.request({
        url: `/crm/v3/objects/contacts/batch/read`,
        options: {
          method: 'POST',
          headers: {
            "Content-type": "application/json"
          },
          body: {
            properties: allContactProperties,
            inputs: contactIds.map(id => ({ id }))
          }
        }
      });
      const matchingContact = contactsData?.results?.find(contact =>
        contact.properties.firstname?.toLowerCase() === firstname?.toLowerCase() &&
        contact.properties.lastname?.toLowerCase() === lastname?.toLowerCase()
      );
      if (matchingContact) {
        //contactId = contactSearchResponse.results[0].id;
        data.hubspotCompanies[0].contacts = {
          results: [matchingContact]
        };
        data.existingContact = true
      } else {
        data.hubspotCompanies[0].contacts = data.company[0].contacts
        console.log("contact doesn't exist")
      }
    } else {
      data.hubspotCompanies[0].contacts = data.company[0].contacts
      console.log("contact doesn't exist")
    }
  } else {
    data.hubspotCompanies = data.company
    console.log("company doesn't exist")
  }

}
data.AIEnrich = true

};
