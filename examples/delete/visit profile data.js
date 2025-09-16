/**
 * Step: visit profile data
 * ID: czvo8xwnxjr1712vth5q1choqk2p8oui
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
visitData: true
};

export const content = async () => {
const companyName = data.data.Company || '';
const companyWebsite = data?.data?.CompanyWebsite;
const domainOnly = companyWebsite
    ?.replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
const cleanedCompanyName = companyName.replace(/\b(LLP|INC|LTD|LIMITED)\b\.?/gi, '').trim();
const positionObj = data?.data?.extended?.positions[0];
const schoolObj = data.data?.extended?.schools[0];
const skillsArray = data?.data?.extended?.skills;

const linkedin_skills = Array.isArray(skillsArray)
  ? skillsArray.filter(skill => skill && skill.trim() !== '').join(', ')
  : '';

const formatObjToString = (obj) =>
  obj
    ? Object.entries(obj)
      .filter(([_, value]) => value && value.toString().trim() !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
    : '';

const linkedin_current_position = formatObjToString(positionObj);
const linkedin_schools = formatObjToString(schoolObj);

let x = ''
if (data.$via.name === "dux-soup-James") {
  x = 'Dr. James, Head of our Sustainability department,'
} else if (data.$via.name === "dux-soup-Tim") {
  x = 'our Director Tim'
}
const message = `I am Head of Sales at Advantage Utilities. I understand you connected with ${x} on LinkedIn last week, and he passed me your details from LinkedIn. We help businesses reduce costs for all aspects of their utility and energy requirements and he asked me to reach out as there may be some support we can offer.

Would you have a few minutes to jump on a video call with us`

const hubspotCompanies = [
  {
    properties: {
      name: cleanedCompanyName,
      website: data.data.CompanyWebsite,
      domain: domainOnly,
      linkedin_industry: data.data.Industry,
      industry: data.data.Industry,
      linkedin_company_page: data.data.CompanyProfile,
      city: data.data.Location,
      ucDate: false
    },
    contacts: {
      results: [
        {
          properties: {
            firstname: data.data['First Name'],
            lastname: data.data['Last Name'],
            email: data.data.Email,
            phone: data.data.Phone,
            jobtitle: data.data.Title,
            city: data.data.Location,
            ds_liindustry: data.data.Industry,
            linkedin_summary: data.data.Summary,
            linkedin_url: data.data.Profile,
            linkedinconnections: data.data.Connections,
            linkedin_sales_profile: data.data.SalesProfile,
            linkedin_personal_website: data.data.PersonalWebsite,
            linkedin_scan_date: new Date(data.data.VisitTime),
            linkedin_skills: linkedin_skills,
            linkedin_current_position: linkedin_current_position,
            linkedin_schools: linkedin_schools,
            email_for_linkedin_contact: message
          }
        }
      ]
    },
    contactsNumber: 1
  }
];
data.company = hubspotCompanies
data.duxSoup = true
data.checkHubspot = true

};
