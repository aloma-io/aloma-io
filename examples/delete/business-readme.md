# Advantage Utilities Lead Enrichment & Outreach Automation

**Elevator Pitch:**  
Imagine a super-organized personal assistant who keeps your contact list up-to-date, researches your leads, writes custom emails, and makes sure no opportunity slips through the cracks—all while you focus on the big picture.

---

## What This Automation Does (In Simple Terms)

- Reads new business contacts from your LinkedIn and company lists
- Gathers and updates missing details (like email, phone, company info) automatically
- Checks if contacts already exist in your main contact system (HubSpot)
- Writes personalized, professional outreach emails using smart assistants
- Logs all updates and outreach attempts for easy tracking
- Enrolls contacts into follow-up sequences so nobody gets forgotten
- Frees your team from repetitive research and data entry

---

## Step-by-Step Breakdown

### 1. Start with LinkedIn Profiles
- **Step Name:** Check LinkedIn Profile (James/Tim)
- **What happens:** The automation checks if a new LinkedIn contact (from James or Tim’s list) is ready for processing.
- **Real-world comparison:** Like a filing clerk checking if a new business card has all the info before filing it.
- **Why it matters:** Ensures only complete, useful contacts are processed, saving time and avoiding errors.
- **Dependencies:** LinkedIn URLs and emails must be kept current in the Google Sheets used by James and Tim.

### 2. Gather Profile Details
- **Step Name:** Gather Profile Details
- **What happens:** Pulls all available information from the LinkedIn profile and organizes it neatly.
- **Real-world comparison:** Like a personal assistant reading a business card and filling in missing details from LinkedIn.
- **Why it matters:** Makes sure you have the most up-to-date and complete info for each contact.
- **Dependencies:** LinkedIn profiles and Google Sheets must be maintained with accurate links.

### 3. Check for Existing Records
- **Step Name:** Check for Existing Contact
- **What happens:** Looks in your main contact system (HubSpot) to see if the person or company is already there.
- **Real-world comparison:** Like a receptionist checking the company address book before adding a new entry.
- **Why it matters:** Avoids duplicates and keeps your contact list tidy.
- **Dependencies:** HubSpot must have up-to-date company and contact records.

### 4. Create or Update Contact and Company
- **Step Name:** Update or Add to Contact List
- **What happens:** Adds new contacts or updates existing ones with fresh info.
- **Real-world comparison:** Like a secretary updating a Rolodex with new phone numbers and job titles.
- **Why it matters:** Keeps your contact list accurate and ready for outreach.
- **Dependencies:** HubSpot must be accessible and set up to accept updates.

### 5. Fill in Missing Details
- **Step Name:** Research Missing Info
- **What happens:** If any important details (like email or phone) are missing, the automation asks a smart assistant to find them.
- **Real-world comparison:** Like a private investigator tracking down a missing phone number.
- **Why it matters:** Ensures you have everything needed to reach out to your leads.
- **Dependencies:** FullEnrich service must have enough credits and access to up-to-date data.

### 6. Verify Email Addresses
- **Step Name:** Double-Check Emails
- **What happens:** Checks if email addresses are valid and safe to use.
- **Real-world comparison:** Like calling a number to make sure it works before sending a letter.
- **Why it matters:** Reduces bounce-backs and keeps your sender reputation strong.
- **Dependencies:** NeverBounce service must be active and contacts must have email addresses.

### 7. Research Company and Industry News
- **Step Name:** Gather Company & Industry News
- **What happens:** Finds recent news about the company and its industry to personalize your outreach.
- **Real-world comparison:** Like a sales rep reading the newspaper before calling a client.
- **Why it matters:** Helps you start conversations that are relevant and timely.
- **Dependencies:** Perplexity and Google Serper services must be working; company names and industries must be accurate.

### 8. Write Personalized Email Messages
- **Step Name:** Draft Outreach Email
- **What happens:** Uses smart assistants to write a tailored email for each contact, based on the latest info and news.
- **Real-world comparison:** Like having a professional copywriter draft your sales emails.
- **Why it matters:** Boosts response rates with messages that feel personal and relevant.
- **Dependencies:** OpenAI and Claude must be set up; campaign prompts in Google Sheets should be kept up-to-date.

### 9. Refine and Approve Email Content
- **Step Name:** Polish Email Message
- **What happens:** Another smart assistant reviews and improves the email to sound natural and professional.
- **Real-world comparison:** Like a colleague proofreading your letter before you send it.
- **Why it matters:** Ensures your outreach is polished and on-brand.
- **Dependencies:** Claude service must be available.

### 10. Log Updates and Outreach
- **Step Name:** Record in Contact List and Log Sheet
- **What happens:** Updates your main contact system with the new email and logs the activity in a tracking sheet.
- **Real-world comparison:** Like marking off a checklist and updating a client file after making a call.
- **Why it matters:** Keeps everyone on the same page and makes results easy to track.
- **Dependencies:** HubSpot and Google Sheets must be accessible.

### 11. Enroll in Follow-Up Sequences
- **Step Name:** Add to Follow-Up Plan
- **What happens:** Puts each contact into a scheduled follow-up plan so no one is forgotten.
- **Real-world comparison:** Like a calendar reminder to call a client next week.
- **Why it matters:** Ensures consistent, timely follow-up with every lead.
- **Dependencies:** HubSpot sequences must be set up; each company must have an assigned owner in HubSpot.

---

## Decision Points (for Branching Logic)

### Decision: How Should This Contact Be Processed?

- **Path A: Production Campaign (Full Outreach)**
  - Used when running a scheduled campaign for a list of companies.
  - Steps: Gather Company List → Filter & Prepare Companies → Get Contacts → Verify Emails → Research News → Write Email → Refine Email → Log Updates → Add to Follow-Up Plan

- **Path B: LinkedIn One-Off (Quick Add)**
  - Used when processing a single new LinkedIn contact.
  - Steps: Check LinkedIn Profile → Gather Profile Details → Check for Existing Contact → Update or Add to Contact List → Research Missing Info → (if needed) Add to Follow-Up Plan

**How Different Paths Serve Business Needs:**
- **Path A** is for batch processing, perfect for regular campaigns and ensuring every company in your target list is contacted.
- **Path B** is for ad-hoc, high-touch additions, making sure new LinkedIn connections are quickly and accurately added to your system.

**Dependencies for Both Paths:**
- Company and contact lists in HubSpot and Google Sheets must be kept up-to-date.
- Each company must have an owner assigned in HubSpot for proper follow-up.

---

## Impact Section

### What Makes This Special

- **Speed:** What used to take hours of research, data entry, and email writing now happens in minutes.
- **Accuracy:** Like a detail-oriented assistant, it double-checks and fills in missing info, reducing mistakes.
- **Consistency:** Every lead gets the same high-quality, timely follow-up—no more missed opportunities.
- **Cost Benefits:** Frees up your team to focus on building relationships and closing deals, not manual admin work.

### Before vs After

| Before Automation                  | After Automation                        |
|-------------------------------------|-----------------------------------------|
| Manual data entry from LinkedIn     | Automatic info gathering and updating   |
| Hours spent researching companies   | Instant news and insights provided      |
| Generic, copy-paste emails          | Personalized, AI-crafted messages       |
| Missed follow-ups and lost leads    | Every lead gets timely, tracked outreach|
| Team bogged down in admin tasks     | Team focuses on high-value conversations|

### Who Benefits

- **Sales Teams:** Spend more time talking to prospects, less time on admin.
- **Marketing Teams:** Get better data for campaigns and reporting.
- **Managers:** Enjoy clear tracking and reporting without chasing updates.
- **Business Analysts:** See the full picture with accurate, up-to-date records.
- **Executives:** Know that every opportunity is being followed up on, reliably.

---

## Conclusion

**Bottom Line:**  
This automation acts like your dream office assistant—handling the repetitive, time-consuming parts of lead management so your team can focus on what really matters: building relationships and growing the business. It doesn’t replace people; it empowers them to do their best work.

---

## Support

Need help or want to customize this workflow?  
Contact the Advantage Utilities automation team or your Aloma support representative. We’re here to help you get the most out of your automation!