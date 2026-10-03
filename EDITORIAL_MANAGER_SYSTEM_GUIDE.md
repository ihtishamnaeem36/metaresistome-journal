# 🏛️ Scholarly Manuscript Submission Systems & Editorial Workflow Guide
**Author Reference & System Architecture for the Journal of MetaResistome (JMR)**

---

## 1. What is Editorial Manager (EM)?

**Editorial Manager (EM)**, developed by Aries Systems (an Elsevier company), is the most widely adopted commercial manuscript submission, peer review, and editorial tracking platform in academic publishing. It is used by major publishers including:
* **Elsevier** (e.g. *Journal of Hazardous Materials*, *Cell Genomics*, *Lancet*, *Biomaterials*)
* **Springer Nature** (select titles)
* **Wiley** (select titles)
* **Wolters Kluwer** / **Lippincott**
* **PLOS** (historically)

Other comparable commercial enterprise systems include:
* **ScholarOne Manuscripts** (Clarivate / Web of Science)
* **eJournalPress (EJP)**
* **Elsevier Submission System (ESS)** (Elsevier's newer next-gen interface)

Open-source alternatives in academia:
* **Open Journal Systems (OJS)** by Public Knowledge Project (PKP) — widely used for independent university journals.
* **Janeway** (Open Library of Humanities).

---

## 2. Elsevier / Editorial Manager Standard Submission Workflow

When an author clicks **"Submit Your Article"** on an Elsevier journal website, they are taken to a guided, multi-step wizard:

```
[1. Article Type] ──▶ [2. Attach Files] ──▶ [3. General Information] ──▶ [4. Declarations & Authors] ──▶ [5. Review & Build PDF] ──▶ [Submit]
```

### Stage 1: Select Article Type
The author must designate the manuscript category:
* **Original Research Article**: Full empirical genomic/metagenomic investigations (typically 5,000–8,000 words).
* **Review Article**: Comprehensive thematic synthesis of current literature (typically 6,000–10,000 words).
* **Short Communication / Rapid Report**: Brief, high-impact novel discoveries or outbreak alerts (2,500 words).
* **Metagenomic Dataset & Resource Note**: Curated, open-access genomic datasets, wastewater baseline profiles, or bioinformatics pipeline tools (3,000 words).
* **Perspective / Commentary**: Commissioned or unsolicited expert opinions on AMR policy and surveillance (1,500–3,000 words).

*System behavior:* The article type determines which file types are mandatory and sets word/figure limits in validation checks.

---

### Stage 2: Attach Files (Item Type Designation & Upload)
This is the core stage where authors upload their materials. Editorial Manager enforces strict item classification:

| Item Type | Multiplicity | Accepted Formats | Mandatory? | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Cover Letter** | Single File Only | `.pdf`, `.docx` | **Yes** | Confidential letter to the Editor-in-Chief detailing novelty, significance, and ethical compliance. |
| **Manuscript File** | Single File Only | `.docx`, `.pdf`, `.odt` | **Yes** | Complete main text with abstract, introduction, methods, results, discussion, and references. |
| **Title Page** | Single File Only | `.docx`, `.pdf` | Optional/Conditional | For double-blind peer review: Contains author names, affiliations, email addresses, and funding. |
| **Figure(s)** | Multiple Files | `.tif`, `.png`, `.jpg`, `.eps` | Optional | High-resolution figures (300+ DPI for photos, 600+ DPI for line graphs) with captions. |
| **Table(s)** | Multiple Files | `.docx`, `.xlsx` | Optional | Separate data tables with explanatory notes. |
| **Supplementary Material** | Multiple Files | `.pdf`, `.zip`, `.xlsx`, `.fasta` | Optional | Raw data tables, primers, extended statistical outputs, supplementary trees. |
| **Graphical Abstract** | Single File | `.png`, `.jpg`, `.svg` | Recommended | Visual summary of findings for indexing and social dissemination. |
| **Declaration of Competing Interests** | Single File | `.pdf`, `.docx` | Conditional | Signed COI disclosure form if conflict exists. |

#### Critical System Rules (Single-File vs. Multi-File):
* **Single-File Limit:** Items like **Cover Letter**, **Manuscript File**, and **Graphical Abstract** can only have ONE active file. If the author attempts to upload a second file under the same category, the system blocks it and displays a warning in red:
  > *"A Cover Letter is already attached ('Cover_Letter_2026.docx'). To replace it, click the red ❌ (Remove) button next to the existing file before uploading a new version."*
* **Multi-File Limit:** Categories like **Figures**, **Tables**, and **Supplementary Files** allow multiple sequential uploads with automatic numbering (Figure 1, Figure 2, Table 1, Table 2).
* **Progression Gate:** The author **cannot advance** to Stage 3 until all mandatory files (`Cover Letter` and `Manuscript File`) are attached and validated.

---

### Stage 3: Manuscript Details & Metadata
The author enters scholarly metadata used for indexing and reviewer matching:
1. **Full Article Title** (concise, informative, no unstandardized acronyms).
2. **Abstract** (structured or unstructured, typically 250 words maximum).
3. **Keywords** (3 to 6 controlled terms for indexing).
4. **Subject Category / Section**: (e.g., *Antimicrobial Resistance Genomics*, *Wastewater & Environmental Metagenomics*, *One Health Pathogen Surveillance*, *Bioinformatics & Machine Learning*).

---

### Stage 4: Declarations, Policies & Author Questionnaire
Adapted directly from the **Guide for Authors** and COPE publication ethics:
1. **Originality & Prior Publication:**
   * *"Has this manuscript or any part of it been published previously or is it currently under consideration by any other journal?"*
   * Must answer **No** (or provide pre-print DOI e.g. bioRxiv/medRxiv).
2. **Conflict of Interest / Competing Interests:**
   * Full disclosure of financial, commercial, or personal relationships that could be perceived as influencing the work.
3. **Research Funding & Grant Sponsorship:**
   * Names of funding agencies and grant numbers (or statement that research received no external funding).
4. **Ethical Approval & Biosafety Statement:**
   * Institutional Review Board (IRB), Animal Care (IACUC), or Biosafety Level (BSL) approvals where applicable.
5. **Data & Code Availability:**
   * Mandatory deposition statement for raw sequencing reads (e.g. NCBI SRA, BioProject PRJNA) and code (GitHub/Zenodo).
6. **Authorship & Affiliations:**
   * Detailed listing of Corresponding Author and all Co-Authors with ORCID iDs, institutional affiliations, and email addresses.
7. **Suggested & Opposed Reviewers:**
   * Option to suggest 2 qualified peer reviewers (with institutional emails) and request exclusions for direct competitors.

---

### Stage 5: Hybrid Publishing Model Selection
In a **Hybrid Journal**:
* The author is presented with the publication model choice:
  1. **Gold Open Access:** Published under Creative Commons Attribution (CC BY 4.0). Immediate worldwide public access.
  2. **Subscription Publishing:** Traditional publishing model with no author-facing article processing fees (zero APC).

---

### Stage 6: PDF / Submission Package Build & Final Submission
In commercial systems, the server merges the uploaded Word/LaTeX files and high-res images into a unified "Built PDF for Peer Review". The author must inspect this PDF, confirm approval, and click **Submit Manuscript**.

---

## 3. How the Editorial Office Receives Submissions (Practical Solutions)

Because JMR is currently hosted as a static web system on GitHub Pages, here is how the Editor-in-Chief can receive 100% of the submission packages securely and free of charge:

### Option A: Direct Manifest Package + Client-Side ZIP (Included in JMR)
* When an author clicks **"Submit Manuscript"**:
  1. The portal compiles all form fields into an official scholarly manifest: `JMR_Submission_Manifest_[TrackingID].json`.
  2. The portal bundles all uploaded files (manuscript, cover letter, figures) into a timestamped `.zip` archive: `JMR_Submission_[TrackingID].zip`.
  3. The browser automatically downloads this complete submission package to the author's computer.
  4. An automated editorial dispatch pre-fills an official submission email to `editor@metaresistome.org` with the manuscript ID, title, abstract, author list, and declarations.
  5. The author attaches the `.zip` archive or uploads it to a secure repository link.

### Option B: Free Serverless Google Apps Script + Google Drive Intake (Zero Cost)
* A 15-line Google Apps Script acts as an automated web API endpoint:
  * Creates a dedicated folder in the journal's Google Drive: `Submissions/JMR-2026-0001/`
  * Saves all uploaded files (Word, PDF, Figures) directly to Google Drive.
  * Sends an instant notification email to `editor@metaresistome.org` with direct links to the files.
  * Authors never leave the website, and the editorial office gets unlimited free storage.

### Option C: Formspree / Webhook / Netlify Forms
* Connects the form submit event to a serverless webhook that delivers metadata and file download links directly into the editorial inbox.

---

## 4. Glossary of Editorial Workflow Terms

* **Desk Review (Triage):** Initial 3–7 day review by the Editor-in-Chief to verify scope, formatting, and plagiarism before sending to external peer reviewers.
* **Double-Anonymized (Double-Blind):** Peer review where both authors and reviewers remain anonymous to each other.
* **Tracking ID:** Unique identifier assigned at submission (e.g. `JMR-2026-0001`).
* **APC (Article Processing Charge):** Fee associated with Open Access publishing. In JMR's hybrid model, subscription publication carries zero fee.
