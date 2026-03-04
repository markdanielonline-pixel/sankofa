export default function PoliciesPage() {
  return (
    <main
      style={{
        padding: "140px 20px",
        maxWidth: "1050px",
        margin: "auto",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "14px" }}>
        Policies & Compliance
      </h1>

      <p style={{ opacity: 0.8, lineHeight: "1.8", marginBottom: "28px" }}>
        This page contains the full legal policies of Sankofa Publishers, LLC.
      </p>

      <div
        style={{
          border: "1px solid rgba(212,175,55,0.25)",
          background: "rgba(0,0,0,0.25)",
          padding: "16px",
          borderRadius: "12px",
          marginBottom: "28px",
        }}
      >
        <div style={{ opacity: 0.9, marginBottom: "10px" }}>
          Jump to section:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                color: "#d4af37",
                textDecoration: "none",
                border: "1px solid rgba(212,175,55,0.35)",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "13px",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {SECTIONS.map((s, idx) => (
          <section
            key={s.id}
            id={s.id}
            style={{
              border: "1px solid rgba(212,175,55,0.22)",
              background: "rgba(0,0,0,0.18)",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <details open={idx === 0}>
              <summary
                style={{
                  listStyle: "none",
                  cursor: "pointer",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: "15px", letterSpacing: "1px" }}>
                  {s.label}
                </span>
                <span style={{ opacity: 0.7, fontSize: "12px" }}>
                  click to open or close
                </span>
              </summary>

              <div style={{ padding: "18px" }}>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.75",
                    fontSize: "14px",
                    opacity: 0.92,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  }}
                >
                  {s.content}
                </pre>
              </div>
            </details>
          </section>
        ))}
      </div>

      <div style={{ marginTop: "34px", opacity: 0.75, fontSize: "13px" }}>
        Compliance contact:{" "}
        <a
          href="mailto:compliance@sankofapublishers.com"
          style={{ color: "#d4af37", textDecoration: "none" }}
        >
          compliance@sankofapublishers.com
        </a>
      </div>
    </main>
  )
}

const SECTIONS: { id: string; label: string; content: string }[] = [
  {
    id: "terms-and-conditions",
    label: "TERMS AND CONDITIONS",
    content: `TERMS AND CONDITIONS

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

1. Acceptance of Terms
These Terms and Conditions (“Terms”) govern all use of the website, submission processes, publishing relationships, service engagements, royalty administration, and financial transactions conducted with Sankofa Publishers, LLC (“Sankofa,” “Company,” “we,” “us,” or “our”).
By accessing this website, submitting content, purchasing services, receiving publication, or engaging in any contractual relationship with Sankofa, you (“Author,” “Client,” or “User”) agree to be legally bound by these Terms.
If you do not agree, you must discontinue use immediately.

2. Eligibility
Users must be at least eighteen (18) years of age.
Individuals under eighteen may engage services only with express written consent of a parent or legal guardian, who shall be jointly and severally liable for all contractual obligations.

3. Intellectual Property Ownership
Submission of a manuscript does not transfer ownership to Sankofa.
Authors retain:
• 100 percent copyright ownership
• 100 percent intellectual property rights
Upon execution of a formal Publishing Agreement, Author grants Sankofa limited, non-exclusive rights necessary for production, distribution, and marketing.
No rights are granted absent written agreement.

4. Author Representations and Warranties
Author represents and warrants that:
• The work is original or lawfully licensed
• Author holds full legal authority over the material
• The work does not infringe intellectual property rights
• The work contains no defamatory or unlawful material
• All AI generated or AI assisted content has been fully disclosed
• All third party content is properly cited. Disclosure must include the tools used and which portions were AI-assisted or AI-generated.
If a manuscript contains allegations, accusations, or potentially damaging claims about real individuals or entities, Sankofa Publishers may require substantiation, revisions, and/or independent legal review at the author’s expense before proceeding.
Author agrees to indemnify, defend, and hold harmless Sankofa from any claims arising from breach of these warranties.

5. Editorial Discretion
Sankofa retains sole editorial discretion in manuscript evaluation.
Purchase of services does not guarantee publication.
Editorial decisions are final and may include:
• Full Acceptance
• Rejection
• Conditional Acceptance

6. Royalty Structure
Authors retain one hundred percent (100%) of net royalty earnings by default. Authors may voluntarily allocate any percentage of royalties to Sankofa Publishers. Such allocation must be defined in a signed Publishing Agreement and remains in effect for the duration of the contract unless amended in writing.
Net revenue shall mean gross retail sales less:
• Retailer fees
• Distribution fees
• Printing costs
• Payment processing costs
Sankofa does not impose mandatory royalty percentages.
Royalty payments may be administered manually or through optional automated portal services.
Sankofa shall not be liable for delays or reporting inaccuracies caused by third party distributors or retailers.

7. Payment Processing
All financial transactions are processed through verified third party payment processors.
Sankofa does not store complete credit card data.
International transactions may incur currency conversion or gateway fees beyond Sankofa’s control.

8. Service Fees and Non Refundable Deposits
Deposits for professional services are non refundable.
Deposits secure scheduling, staffing allocation, and resource commitment.
Milestone payments must be satisfied before service progression.
Final deliverables shall not be released until full payment is received.

9. Chargebacks and Fraud
Initiation of a chargeback after receipt of services constitutes material breach.
In cases of confirmed fraudulent chargebacks, Sankofa reserves the right to:
• Immediately terminate services
• Pursue recovery of funds
• Initiate collections or legal remedies
• Report fraudulent conduct

10. Confidentiality
Submitted manuscripts are treated as confidential.
Ghostwriting engagements are governed by formal confidentiality agreements.
Upon request, Sankofa may execute Non Disclosure Agreements for high profile clients.

11. Morality Clause
Sankofa reserves the right to suspend or terminate publishing agreements if an Author engages in criminal conduct, fraud, hate speech, or public behavior that materially damages the reputation or operational integrity of Sankofa.
Such determination shall be made at Sankofa’s reasonable discretion.

12. Limitation of Liability
To the maximum extent permitted by law, Sankofa’s total liability for any claim shall not exceed the total amount paid by Author for the specific service giving rise to the claim.
Sankofa shall not be liable for:
• Indirect damages
• Consequential damages
• Lost profits
• Retail performance
• Bookseller decisions
• Market response
• Distributor conduct
Publishing outcomes cannot be guaranteed.

13. Dispute Resolution
Any dispute, claim, or controversy arising out of or relating to these Terms, our services, or any related agreement shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The seat and venue of arbitration shall be Santa Fe County, New Mexico, United States. The arbitration shall be conducted in English by one arbitrator. Judgment on the award may be entered in any court of competent jurisdiction.
Each party shall bear its own legal costs unless otherwise ordered.

14. Class Action Waiver
Author agrees that any dispute shall be brought solely in an individual capacity and not as part of any class action or representative proceeding.
Class arbitration and class litigation are expressly waived.

15. Withdrawal Policy
Authors may withdraw works upon thirty (30) days written notice.
Removal timelines may be subject to distributor processing schedules.
Sankofa shall not be liable for third party removal delays.

16. Force Majeure
Sankofa shall not be liable for delays caused by events beyond reasonable control, including but not limited to natural disasters, governmental action, technical outages, or distributor disruptions.

17. Severability
If any provision is deemed unenforceable, remaining provisions shall remain in effect.

18. Modifications
Sankofa may update these Terms periodically.
Continued use constitutes acceptance of revisions.

Compliance Contact:
compliance@sankofapublishers.com`,
  },

  {
    id: "privacy-policy",
    label: "PRIVACY POLICY",
    content: `PRIVACY POLICY

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

1. Introduction
Sankofa Publishers, LLC (“Sankofa,” “Company,” “we,” “us,” or “our”) is committed to protecting the privacy and security of personal information collected through our website, submission portals, publishing operations, and service engagements.
This Privacy Policy describes how we collect, use, disclose, and safeguard information.
By using our website or services, you consent to the practices described herein.

2. Information We Collect
We may collect the following categories of information:
A. Personal Identification Information
• Full name
• Email address
• Phone number
• Mailing address
• Country of residence
• Banking information for royalty payouts
• Business identification information
B. Manuscript and Intellectual Content
• Submitted manuscripts
• Synopses
• Author biographies
• Editorial correspondence
C. Financial Information
Payments are processed through verified third party payment processors.
We do not store full credit card numbers.
We may store limited transactional data necessary for accounting and reporting purposes.
D. Technical Information
• IP address
• Browser type
• Device type
• Cookies and analytics data

3. How We Use Information
We use collected information to:
• Evaluate manuscript submissions
• Administer publishing agreements
• Process royalty payments
• Provide professional services
• Communicate with authors
• Maintain compliance
• Improve website performance
• Prevent fraud and abuse
We do not sell personal data.

4. Legal Basis for Processing
Where applicable under international law, we process data based on:
• Contractual necessity
• Legal compliance
• Legitimate business interests
• User consent

5. Data Sharing
We may share information with:
• Distribution partners
• Printing partners
• Payment processors
• Legal or accounting advisors
• Technology service providers
Such parties are bound by confidentiality obligations.
We do not share personal data for advertising resale purposes.

6. International Data Transfers
Data may be transferred to and processed in the United States.
By submitting information from outside the United States, you consent to such transfer.
International transfers may involve jurisdictions with differing data protection standards.

7. Data Security
We implement reasonable administrative, technical, and organizational safeguards to protect personal information.
However, no electronic transmission is entirely secure.
Users assume inherent risks associated with digital communication.

8. Data Retention
We retain personal information only as long as necessary for:
• Contractual fulfillment
• Legal compliance
• Dispute resolution
• Operational integrity
Manuscripts may be retained for archival and recordkeeping purposes unless removal is requested.

9. Author Portal Data
Authors opting into automated reporting services authorize secure bank account integration through verified third party providers.
Sankofa does not store full banking credentials.
Authors are responsible for maintaining security of their login credentials.

10. Minors
We do not knowingly collect data from individuals under 18 without parental consent.
Parents or guardians may contact compliance@sankofapublishers.com to request removal of minor data.

11. Your Rights
Depending on jurisdiction, users may have rights to:
• Access personal data
• Request correction
• Request deletion
• Object to processing
• Request data portability
Requests may be directed to compliance@sankofapublishers.com.
We may retain data where legally required.

12. Cookies and Tracking
Our website may use cookies to:
• Improve user experience
• Track analytics
• Maintain session security
Users may disable cookies through browser settings, though functionality may be limited.

13. Third Party Links
Our website may contain links to third party platforms.
We are not responsible for third party privacy practices.

14. Changes to Privacy Policy
We reserve the right to update this Privacy Policy.
Continued use of our website constitutes acceptance of modifications.

15. Contact Information
For privacy inquiries:
compliance@sankofapublishers.com
Sankofa Publishers, LLC
State of New Mexico
United States`,
  },

  {
    id: "refund-and-payment-policy",
    label: "REFUND AND PAYMENT POLICY",
    content: `REFUND AND PAYMENT POLICY

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

1. Scope
This Refund and Payment Policy governs all financial transactions between Sankofa Publishers, LLC (“Sankofa,” “Company,” “we,” “us”) and any Author or Client (“Client”).
This policy applies to:
• Editorial services
• Ghostwriting
• Design services
• Marketing services
• Publishing Readiness Assessments
• Audiobook production
• Author Portal automation
• Subscription services
• Corporate publishing services

2. Publishing Fees
Publication of accepted, publication ready manuscripts carries no upfront publishing fee.
No refund policy applies to free publishing.

3. Deposits
All service deposits are non refundable.
Deposits secure:
• Scheduling allocation
• Editorial staffing
• Production slot reservation
• Administrative preparation
Upon receipt of deposit, Sankofa commits internal resources to the project.
Deposits compensate for this commitment.

4. Milestone Payments
For services structured under milestone payment schedules:
• Payment is required prior to commencement of each phase.
• Work pauses if payment is not received.
• Final deliverables are not released until full payment is satisfied.
Partial payments do not entitle Client to partial ownership of incomplete deliverables.

5. Publishing Readiness Assessment Refund Guarantee
If a Publishing Readiness Assessment is purchased at the time of manuscript submission and the manuscript is not accepted for publication, the Client shall receive a 100 percent refund of the PRA fee.
This refund applies only to PRA services purchased in conjunction with manuscript submission.
Refunds do not apply if rejection results from:
• Plagiarism
• Undisclosed AI content
• Fraudulent representation
• Material breach of submission terms

6. Ghostwriting and Custom Services
Ghostwriting and custom publishing services are high commitment engagements.
Refunds are not available once:
• Research phase has begun
• Interviews have been conducted
• Drafting has commenced
In limited circumstances of documented breach by Sankofa, proportional refund may be issued at the Company’s discretion.

7. Marketing Services
Campaign based marketing services are non refundable once campaign preparation has begun.
Subscription marketing services may be canceled prior to the next billing cycle.
No prorated refunds are issued for partially completed campaign periods.

8. Audiobook Production
Audiobook production services are non refundable once:
• Narration has begun
• Recording sessions are scheduled
• Production files are in progress
Full payment must be completed prior to final master audio delivery.
If Client pays for audiobook production, Client retains full ownership of the produced audio files and royalties. Sankofa does not retain ongoing royalty participation.

9. Author Portal Automation Subscription
The optional Author Portal automated reporting service is billed monthly.
Clients may cancel at any time prior to the next billing date.
No partial refunds are issued for active billing periods.
Manual reporting remains available at no cost.

10. Payment Failures
If a payment fails or is declined:
• Services may be paused immediately
• Deadlines may be extended
• Production scheduling may be lost
Repeated payment failures may result in termination of service agreement.

11. Chargebacks
Initiating a chargeback after receiving services constitutes material breach.
Sankofa reserves the right to:
• Suspend services
• Terminate agreements
• Recover fees
• Pursue collections or legal remedies
Clients are encouraged to contact compliance@sankofapublishers.com prior to initiating disputes.

12. Refund Processing
Approved refunds will be processed through the original payment method where possible.
Refund timelines may vary based on payment processor policies.

13. Discretion
Except where explicitly guaranteed in this policy, refunds are issued solely at the discretion of Sankofa Publishers, LLC.`,
  },

  {
    id: "royalty-policy-addendum",
    label: "ROYALTY POLICY ADDENDUM",
    content: `ROYALTY POLICY ADDENDUM

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

This Royalty Policy Addendum (“Royalty Policy”) governs royalty calculation, reporting, payment timing, and related definitions for works published through Sankofa Publishers, LLC (“Publisher,” “Sankofa,” “Company”). This Policy may be incorporated by reference into the Publishing Agreement, Terms and Conditions, and Author Portal terms.
In the event of conflict between documents, the Publishing Agreement shall control unless it expressly states otherwise.

1. Core Principle
Authors retain one hundred percent (100%) of net royalty earnings derived from sales of their published works.
Sankofa does not impose mandatory royalty splits.
Authors may voluntarily allocate a portion of royalty earnings to Sankofa, but such allocation is optional and does not affect publishing quality, editorial treatment, distribution access, or operational support.

2. Definitions
2.1 “Gross Sales”
The total retail sales amount collected by retailers, distributors, or platforms for units sold, prior to deductions.
2.2 “Net Revenue”
For purposes of royalty calculation, “Net Revenue” means Gross Sales less the following categories of deductions:
A. Retailer Fees and Discounts
Includes retailer commissions, marketplace discounts, and standard retailer margin structures.
B. Distribution Fees
Includes third party distribution service charges, wholesaler fees, and distribution network costs.
C. Printing Costs
Includes print manufacturing costs for print-on-demand or offset printing, including per unit print cost and any applicable print service charges.
D. Payment Processing Fees
Includes credit card processing fees, payout gateway fees, currency conversion fees, and bank transfer fees charged by third parties.
No other deductions shall be applied unless expressly disclosed in writing and agreed by Author.
2.3 “Royalty”
Royalty equals one hundred percent (100%) of Net Revenue.
2.4 “Sales Report”
A report that includes, at minimum:
• Units sold (by format where available)
• Retail list price
• Gross sales revenue
• Itemized deductions
• Net revenue
• Royalty total
• Reporting period dates
2.5 “Third Party Platforms”
Retailers, distributors, printers, audiobook distributors, marketplaces, and payment processors used to produce, distribute, sell, or remit proceeds.

3. Royalty Calculation
3.1 Standard Calculation
Royalty is calculated per reporting period based on Net Revenue.
3.2 print-on-demand and Print Costs
Where print-on-demand is used, print costs are deducted per unit at the time of sale.
Authors are not required to pay printing costs prior to sale.
3.3 Returns and Chargebacks
Where retailers permit returns, Net Revenue may be reduced by returns, refunds, or chargebacks assessed by retailers.
If negative balances occur due to returns or retailer adjustments, such amounts may be carried forward and offset against future Net Revenue for the same Work.
Sankofa will disclose return adjustments within reports when such data is provided by third party platforms.

4. Reporting and Payment Options
Authors may choose one of the following:
4.1 Standard Manual Reporting (Included)
• Sales reporting issued manually
• Royalty payment issued manually
• Payment and reports delivered every six (6) months
4.2 Automated Author Portal Reporting (Optional Paid Service)
Authors may opt into an automated reporting and payout system (“Portal”) that provides:
• Dashboard access to reporting
• Automated payment submission
• Enhanced visibility of transactions
Portal subscription: $49 per month (subject to change upon notice)
Portal enrollment may require secure bank account connection through a verified third party provider.
Sankofa does not store full banking credentials.

5. Payment Method and Timing
5.1 Timing
Royalty payments are subject to the availability of proceeds from third party platforms.
Retailers and distributors often remit funds on delayed schedules.
Sankofa cannot accelerate third party payout timing.
5.2 Method
Royalty payments may be issued via:
• Bank transfer
• Payment gateway payout
• Other mutually agreed mechanism for international authors
International payouts may incur mandatory third party fees outside Sankofa’s control.
Such fees will be disclosed where possible.

6. Retail Pricing Participation
Sankofa collaborates with Authors on retail pricing.
Sankofa may provide strategic recommendations to support:
• Profitability
• Market competitiveness
• Retail acceptance thresholds
Final pricing decisions shall be made with Author involvement. However, platform pricing constraints may apply.

7. Currency and Exchange Rates
For international sales, currency conversion may occur.
Exchange rates are determined by third party platforms or processors and are outside Sankofa’s control.
Reports may reflect converted values as presented by third party platforms.

8. Transparency Commitment
Sankofa commits to transparency in royalty reporting.
However, Sankofa’s reporting accuracy depends in part on the completeness and accuracy of data supplied by third party platforms.
Sankofa is not liable for reporting gaps caused by third party delays or incomplete data.

9. Voluntary Author Contribution
Authors may elect to allocate a voluntary portion of royalties to Sankofa.
Such allocation:
• Must be explicitly authorized by Author
• May be changed or revoked by Author upon written notice, subject to processing timelines
• Does not affect publishing quality or service level
No coercion is permitted. Contributions are voluntary.

10. Disputes and Audit Requests
Authors may dispute a royalty report by notifying:
compliance@sankofapublishers.com
within sixty (60) days of receipt of the report.
Sankofa will review disputed items and respond in writing.
Where feasible, Sankofa may assist in requesting clarification from third party platforms. However, Sankofa cannot compel third party platforms to revise reporting.
Audit access may be provided at Sankofa’s discretion for reasonable requests.

11. Amendments
Sankofa may update this Royalty Policy.
Updates shall not retroactively reduce royalties for completed reporting periods unless required by law or platform correction.

12. Contact
compliance@sankofapublishers.com`,
  },

  {
    id: "ai-disclosure",
    label: "AI DISCLOSURE AND CONTENT INTEGRITY POLICY",
    content: `AI DISCLOSURE AND CONTENT INTEGRITY POLICY

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

This AI Disclosure and Content Integrity Policy (“Policy”) governs submission, publication, and service engagements involving artificial intelligence tools and content originality standards.
This Policy is incorporated into the Terms and Conditions, Publishing Agreement, and Professional Services Agreement.

1. Purpose
Sankofa Publishers values intellectual rigor, originality, and ethical authorship.
Artificial intelligence tools may assist creative processes. However, transparency is mandatory.
This Policy establishes required disclosures and content integrity standards.

2. Definition of AI Generated or AI Assisted Content. Disclosure must include the tools used and which portions were AI-assisted or AI-generated.
For purposes of this Policy:
“AI Generated Content” refers to text, images, audio, or other material substantially produced by artificial intelligence systems. Disclosure must include the tools used and which portions were AI-assisted or AI-generated.
“AI Assisted Content” refers to content materially developed using AI tools for drafting, rewriting, summarizing, expansion, or stylistic modification. Disclosure must include the tools used and which portions were AI-assisted or AI-generated.
Minor spellcheck, grammar correction, or formatting assistance does not constitute AI generated content requiring disclosure. Disclosure must include the tools used and which portions were AI-assisted or AI-generated.

3. Mandatory Disclosure
Authors must disclose:
• Use of AI drafting tools
• Use of AI for structural rewriting
• Use of AI for research synthesis
• Use of AI for image or cover generation
• Use of AI for audiobook narration
Disclosure must occur at time of manuscript submission or prior to service engagement.
Failure to disclose constitutes material breach.

4. Author Responsibility
Even when AI tools are used:
• Author remains fully responsible for originality
• Author warrants no copyright infringement
• Author warrants no unauthorized derivative work
• Author warrants factual integrity
Use of AI does not transfer liability to Sankofa.

5. Prohibited Conduct
The following is prohibited:
• Submission of fully AI generated manuscripts presented as original authorship
• Submission of AI content trained on proprietary works without license
• Failure to disclose AI assistance
• Use of AI to replicate copyrighted style or content. Disclosure must include the tools used and which portions were AI-assisted or AI-generated.

6. Plagiarism and Integrity Screening
Sankofa may conduct:
• Plagiarism detection analysis
• AI pattern detection review
• Content originality screening
These reviews may occur:
• During submission
• Prior to publication
• After publication if concerns arise

7. Post Publication Discovery
If undisclosed AI use or copyright infringement is discovered after publication, Sankofa reserves the right to:
• Suspend distribution
• Terminate publishing agreement
• Remove the Work from retailers
• Issue public clarification if legally required
Such action may occur without refund.

8. Editorial Discretion
Sankofa reserves discretion to:
• Reject AI dominant manuscripts
• Require additional revisions
• Request verification of authorship
Acceptance is not guaranteed based solely on disclosure.

9. Audiobook AI Narration
If AI narration tools are used in audiobook production:
• Such use must be disclosed
• Rights and licensing must be verified
• No unauthorized voice replication is permitted

10. Indemnification
Author agrees to indemnify and hold harmless Sankofa from claims arising from:
• Undisclosed AI usage
• Copyright infringement
• Misrepresentation of authorship

11. Policy Updates
This Policy may be updated as AI technology and regulatory frameworks evolve.
Continued participation constitutes acceptance of revisions.

Compliance Contact:
compliance@sankofapublishers.com`,
  },

  {
    id: "website-disclaimer",
    label: "WEBSITE DISCLAIMER",
    content: `WEBSITE DISCLAIMER

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

1. General Information Disclaimer
The information provided on this website is for general informational purposes only.
Nothing on this website constitutes:
• Legal advice
• Financial advice
• Tax advice
• Investment advice
• Publishing guarantee
Users should consult independent professionals before making legal, financial, or publishing decisions.

2. No Earnings Guarantee
Sankofa Publishers makes no guarantees regarding:
• Book sales
• Revenue levels
• Bestseller status
• Retail placement
• Media exposure
• Market performance
Publishing outcomes depend on numerous factors outside the control of Sankofa.
Past performance of other authors does not guarantee similar results.

3. No Guarantee of Bookstore Placement
While Sankofa may market titles to physical bookstores, retail stocking decisions are made solely by individual booksellers and retail buyers.
Sankofa cannot guarantee physical shelf placement.

4. No Legal Representation
Nothing on this website or in communication from Sankofa shall be construed as legal representation.
Authors are encouraged to seek independent legal review of agreements.

5. Third Party Platforms
Sankofa works with third party retailers, distributors, printers, and payment processors.
Sankofa is not responsible for:
• Platform outages
• Distribution delays
• Retailer reporting errors
• Payment processing interruptions
• Policy changes by third parties
Use of third party platforms is subject to their respective terms and policies.

6. Contribution Disclaimer
Contributions made to Sankofa are voluntary.
Unless otherwise stated, contributions are not tax deductible.
Sankofa is a for profit entity unless and until legally restructured.
Contributions do not create ownership interest or governance rights.

7. No Partnership or Agency
Use of this website does not create:
• Partnership
• Joint venture
• Agency relationship
• Employment relationship
No party may represent itself as authorized agent of Sankofa without written consent.

8. Content Accuracy
Sankofa endeavors to provide accurate information.
However, the website may contain errors, omissions, or outdated information.
Sankofa reserves the right to correct inaccuracies without notice.

9. External Links
This website may contain links to external sites.
Sankofa is not responsible for the content or policies of third party websites.

10. Limitation of Liability
To the maximum extent permitted by law, Sankofa shall not be liable for:
• Indirect damages
• Consequential damages
• Loss of profits
• Reputational harm
• Business interruption
arising from use of this website.

11. Governing Law
This Disclaimer is governed by the laws of the State of New Mexico.

Compliance Contact:
compliance@sankofapublishers.com`,
  },

  {
    id: "cookie-policy",
    label: "COOKIE POLICY",
    content: `COOKIE POLICY

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

1. Introduction
This Cookie Policy explains how Sankofa Publishers, LLC (“Sankofa,” “Company,” “we,” “us,” or “our”) uses cookies and similar tracking technologies on our website.
This Policy should be read in conjunction with our Privacy Policy.

2. What Are Cookies
Cookies are small data files stored on a user’s device when visiting a website.
Cookies may:
• Enable core website functionality
• Improve user experience
• Track analytics and performance
• Maintain secure sessions
Cookies do not grant access to your device beyond standard browser permissions.

3. Types of Cookies We Use
A. Essential Cookies
These cookies are necessary for:
• Secure login functionality
• Form submission
• Payment processing
• Site security
Disabling these cookies may limit website functionality.

B. Performance and Analytics Cookies
These cookies help us understand:
• Website traffic patterns
• Page usage
• User interaction trends
Analytics data is aggregated and does not identify individual users unless voluntarily submitted.

C. Functional Cookies
These cookies:
• Remember user preferences
• Improve navigation
• Enhance overall user experience

4. Third Party Cookies
Some cookies may be placed by third party providers such as:
• Payment processors
• Analytics services
• Hosting providers
Sankofa does not control third party cookie policies.
Users should review the privacy policies of those providers.

5. Managing Cookies
Users may control or disable cookies through browser settings.
Disabling cookies may:
• Affect website functionality
• Interrupt secure transactions
• Limit certain features

6. Updates
Sankofa reserves the right to update this Cookie Policy.
Continued website use constitutes acceptance of revisions.

Compliance Contact:
compliance@sankofapublishers.com`,
  },

  {
    id: "contribution-terms",
    label: "CONTRIBUTION TERMS ADDENDUM",
    content: `CONTRIBUTION TERMS ADDENDUM

SANKOFA PUBLISHERS, LLC
A New Mexico Limited Liability Company

Effective Date: March 02, 2026

This Contribution Terms Addendum (“Contribution Terms”) governs all voluntary financial contributions made to Sankofa Publishers, LLC (“Sankofa,” “Company”).

1. Nature of Contributions
All contributions made to Sankofa are voluntary.
Contributions:
• Do not purchase equity
• Do not grant ownership interest
• Do not create partnership rights
• Do not establish governance authority
• Do not guarantee publication

2. Tax Status
Unless otherwise formally declared in writing, Sankofa Publishers is a for profit entity.
Contributions are not tax deductible charitable donations.
Contributors are responsible for consulting tax advisors regarding any claimed treatment.

3. No Performance Obligation
Contributions do not obligate Sankofa to:
• Publish specific manuscripts
• Provide services without agreement
• Issue refunds
• Prioritize contributor submissions

4. Refunds
Contributions are non refundable.
Refunds may be issued solely at the discretion of Sankofa in cases of duplicate payments or processing errors.

5. Use of Contributions
Contributions may be used for:
• Operational sustainability
• Infrastructure development
• Platform improvement
• Publishing expansion
Sankofa retains discretion over allocation.

6. Chargebacks
Initiating a chargeback for a voluntary contribution may constitute financial misconduct.
Sankofa reserves the right to pursue recovery where appropriate.

7. Governing Law
These Contribution Terms are governed by the laws of the State of New Mexico.

Compliance Contact:
compliance@sankofapublishers.com

Audiobook Production Ownership
If an author pays Sankofa Publishers (or its contractors) for audiobook production, the author retains full ownership of the master recording and 100% of audiobook royalties. Sankofa Publishers does not participate in royalty sharing for paid audiobook productions.

Contact Information
Sankofa Publishers
102 Marquez Place
Santa Fe, NM 87505
United States`,
  },
]