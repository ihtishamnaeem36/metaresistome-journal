# Scholarly Manuscript Submission Systems and Editorial Workflow Guide
Author Reference and System Architecture for the Journal of MetaResistome (JMR)

---

## 1. What is Editorial Manager?

Editorial Manager, developed by Aries Systems (an Elsevier company), is the most widely adopted commercial manuscript submission, peer review, and editorial tracking platform in academic publishing. It is used by major publishers including:
* Elsevier (e.g. Journal of Hazardous Materials, Cell Genomics, Lancet, Biomaterials)
* Springer Nature (select titles)
* Wiley (select titles)
* Wolters Kluwer / Lippincott

Other comparable commercial enterprise systems include:
* ScholarOne Manuscripts (Clarivate / Web of Science)
* eJournalPress (EJP)
* Elsevier Submission System (ESS)

Open-source alternatives in academia:
* Open Journal Systems (OJS) by Public Knowledge Project (PKP) - widely used for independent university journals.
* Janeway (Open Library of Humanities).

---

## 2. Standard 4-Step Submission Workflow (Minimal List Design)

When an author clicks "Submit Your Article" on the journal website, they are taken to a guided, multi-step portal:

```
[1. Article Type] -> [2. Attach Files] -> [3. Details and Declarations] -> [4. Review and Hybrid Model] -> [Receipt and ZIP Package]
```

### Stage 1: Select Article Type
The author designates the manuscript category from a clean, minimal list design:
* Original Research: Full empirical genomic/metagenomic investigations (5,000 - 8,000 words).
* Review: Comprehensive thematic synthesis of current literature (6,000 - 10,000 words).
* Short Communication: Brief, urgent novel discoveries or outbreak alerts (2,500 words max).
* Dataset Note: Curated, open-access genomic datasets, wastewater baseline profiles, or bioinformatics pipeline tools (3,000 words max).
* Method: Detailed, reproducible protocols for sample preparation, targeted enrichment, sequencing workflows, or benchmarking computational tools (4,000 words max).
* Perspective: Commissioned or unsolicited expert opinions on antimicrobial resistance policy and surveillance (2,000 words max).

System behavior: Single, clear names are used (e.g. "Short Communication", not slash combinations). Clean "Next" button progresses to file attachments.

---

### Stage 2: Attach Files (Item Classification, Multiplicity, and Auto-Reorder)

The system enforces strict item classification:

| Item Type | Multiplicity | Accepted Formats | Mandatory? | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Cover Letter | Single File Only | .pdf, .docx | Yes | Confidential letter to the Editor-in-Chief detailing novelty, significance, and ethical compliance. |
| Manuscript File | Single File Only | .docx, .pdf, .odt | Yes | Complete main text with abstract, introduction, methods, results, discussion, and references. |
| Title Page | Single File Only | .docx, .pdf | Optional | For blinded peer review: Contains author names, affiliations, email addresses, and funding. |
| Figure | Multiple Files | .tif, .png, .jpg, .eps | Optional | High-resolution figures (300+ DPI for photos, 600+ DPI for line graphs) with captions. |
| Table | Multiple Files | .docx, .xlsx | Optional | Separate data tables with explanatory notes. |
| Graphical Abstract | Single File | .png, .jpg, .svg | Optional | Visual summary of findings for indexing and social dissemination. |
| Supplementary Material | Multiple Files | .pdf, .zip, .xlsx, .fasta | Optional | Multi-file raw data tables, primers, extended statistical outputs, supplementary trees. |

#### Single-File vs. Multi-File Rules:
* Single-File Categories: Items like Cover Letter, Manuscript File, and Graphical Abstract accept only one file. If an author attempts to upload a second file under the same category, the system displays a clear red warning:
  "Notice: You have already uploaded a Cover Letter ('file.docx'). This category accepts only one file. To replace it, please click the Remove button next to the existing file in the table below before uploading a new version."
* Multi-File Categories: Supplementary files, Figures, and Tables accept multiple sequential uploads. Multiple supplementary files are standard practice in scholarly publishing (e.g. Supplementary Table S1, Table S2, Supplementary Data).
* Individual Remove Buttons: Every single file in the table has an individual "x Remove" button so authors can remove any specific file and re-upload if needed.
* Auto-Reorder Files Button: Below the table, the "Reorder Files (Standard Sequence)" button automatically rearranges files into the official academic publication sequence:
  1. Cover Letter
  2. Title Page
  3. Manuscript File
  4. Figures
  5. Tables
  6. Graphical Abstract
  7. Supplementary Material
* Automated Text Extraction: When an author attaches a .docx or .txt manuscript file, the system automatically parses the text to identify candidate Title and Abstract, pre-filling them in Step 3 while keeping both completely editable.

---

### Stage 3: Manuscript Details, Declarations, and Authors

1. Full Manuscript Title: Pre-filled from manuscript file, editable.
2. Abstract: Pre-filled from manuscript file, editable. Includes real-time word counter formatted as "X / 250 words" (turns red if > 250 words).
3. Keyword Density Panel (wordcounter.net style): Real-time analysis of the abstract text displaying top keywords with frequency and percentage (e.g. `8 (3%) resistance`, `7 (2%) wastewater`), filtering out standard stop words, with toggle support for single words (`x1`) and 2-word phrases (`x2`). Clicking any density chip automatically appends the term to the Keywords field.
4. Keywords: 3 to 6 terms separated by semicolons (;). Automatically extracted from manuscript files (`Keywords:` header) when available.
5. Scientific Section: Dropdown of primary journal tracks.
6. Declarations:
   * Prior publication / duplicate submission (Yes / No).
   * Conflict of interest (Yes / No).
   * Research funding sources.
   * Ethical approval and biosafety compliance.
   * Mandatory data and code availability statement.
7. Authors:
   * Separated name fields: First Name (Given Name), Middle Name, Family Name (Surname). Author 1 email defaults to blank so authors enter their own address.
   * Stationary Numbering & Move Up / Move Down Reordering: Author cards can be shifted up or down to adjust author sequence, while labels `Author 1`, `Author 2`, `Author 3` stay fixed in sequence.
   * Searchable Autocomplete: Fast interactive search for both Institutions and Countries.
   * Corresponding Author Flexibility: Any author in the sequence can be designated as the corresponding author via an individual radio button.
8. Draft Auto-Save & Recovery:
   * Form state, authors, declarations, and file attachments are auto-saved to local browser storage (`localStorage`).
   * If a user accidentally closes or refreshes the page, their draft is restored with a notification banner.
   * A "Start Over Clean" button allows authors to discard the draft and begin a fresh submission at any time.

---

### Stage 4: Hybrid Journal Model Selection

The Journal of MetaResistome operates as a Hybrid Journal. Authors select:
1. Gold Open Access (CC BY 4.0): Immediate worldwide open access, author retains unrestricted copyright.
2. Subscription Publishing (Zero APC): Traditional publication with no author-facing charges.

---

### Stage 5: Editorial Intake and Editor Portal Access

How the Editor-in-Chief receives and accesses submissions:

1. Automatic Client-Side Archive:
   Upon submission, the portal packages all uploaded files, a structured SUBMISSION_MANIFEST.json, and a human-readable receipt into a timestamped archive: JMR_Submission_Package_[TrackingID].zip.

2. Browser Repository:
   The submission is stored in the local editorial submissions repository.

3. Editor-in-Chief Portal (editor-portal.html):
   * URL: `editor-portal.html`
   * Access: Protected by an editorial passcode (default: `jmr2026`).
   * Dashboard: Displays all active submissions with Tracking ID, Date, Title, Corresponding Author, and Article Type.
   * One-Click Download: Clicking "Download ZIP" immediately downloads the full submission archive containing all raw files and manifest.
   * Details View: Allows inspecting abstract, authors, and ethical declarations directly.

