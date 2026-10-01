/**
 * Journal of MetaResistome (JMR) - Unified Content Repository
 * 
 * SINGLE SOURCE OF TRUTH FOR JOURNAL PAGES & MODAL PREVIEWS
 * Both the homepage modal drawer and the dedicated full-page routes render
 * from this exact data object to ensure zero duplication.
 */

const JOURNAL_CONTENT = {
  aimsAndScope: {
    title: "Aims & Scope",
    slug: "aims-and-scope",
    shortSummary: "Journal of MetaResistome is an independent, peer-reviewed international journal dedicated to publishing high-impact research in antimicrobial resistance (AMR), pathogen genomics, wastewater-based epidemiology, and metagenomic surveillance across One Health interfaces.",
    fullText: `
      <h3>Mission & Scientific Vision</h3>
      <p>The <strong>Journal of MetaResistome (JMR)</strong> provides an authoritative, interdisciplinary platform for the rapid dissemination of rigorous scientific discoveries addressing one of the most pressing global health challenges of our time: the emergence, evolution, and dissemination of antimicrobial resistance.</p>
      
      <p>JMR emphasizes systems-level investigations that integrate high-throughput sequencing, bioinformatic workflows, molecular epidemiology, and environmental surveillance to decipher the resistome, mobilome, and virulome of clinical and environmental pathogens.</p>

      <h3>Primary Areas of Scope</h3>
      <ul>
        <li><strong>Antimicrobial Resistome Characterization:</strong> Identification, molecular profiling, and functional genomics of novel and circulating antibiotic resistance genes (ARGs) across human, animal, and environmental microbiomes.</li>
        <li><strong>Pathogen Genomics & Molecular Epidemiology:</strong> Whole-genome sequencing (WGS), comparative genomics, phylodynamics, and surveillance of priority bacterial, viral, and fungal pathogens.</li>
        <li><strong>Wastewater-Based & Environmental Surveillance:</strong> Metagenomic wastewater monitoring, sewage epidemiology, environmental reservoirs of resistance, and runoff assessment in urban and agricultural matrices.</li>
        <li><strong>Mobilome & Horizontal Gene Transfer (HGT):</strong> Plasmids, transposons, integrons, bacteriophages, and mobile genetic elements mediating the cross-species transfer of multidrug resistance.</li>
        <li><strong>One Health Resistome Dynamics:</strong> Interconnected transmission networks linking clinical healthcare settings, veterinary medicine, livestock production, wildlife, and natural ecosystems.</li>
        <li><strong>Bioinformatics, Machine Learning & Computational Biology:</strong> Novel algorithmic pipelines, deep learning models for resistance prediction, metagenomic assembly benchmarks, and reference resistome databases.</li>
        <li><strong>Novel Therapeutics & Diagnostics:</strong> Next-generation antimicrobials, phage therapy, antimicrobial peptides, and rapid diagnostic platforms for point-of-care pathogen and resistance profiling.</li>
      </ul>

      <h3>Peer Review Philosophy</h3>
      <p>All submitted manuscripts undergo single-blind, rigorous peer review by active domain specialists. We prioritize scientific validity, methodological reproducibility, open data availability, and transparent reporting over speculative novelty.</p>
    `
  },

  editorialBoard: {
    title: "Editorial Board",
    slug: "editorial-board",
    shortSummary: "Led by Founding Editor-in-Chief Dr. Shafiq, the Editorial Board brings together active researchers in pathogen genomics, metagenomics, and clinical microbiology committed to ethical, transparent, and constructive peer review.",
    fullText: `
      <h3>Editorial Leadership</h3>
      <div class="editorial-profile-card">
        <div class="editorial-profile-img">
          <img src="manus-storage/dr-shafiq-microbiology-lab-portrait_6437b0f3.webp" alt="Dr. Shafiq" />
        </div>
        <div class="editorial-profile-info">
          <h4>Dr. Shafiq</h4>
          <span class="role-badge">Founding Editor-in-Chief</span>
          <p class="affiliation">Laboratory of Pathogen Genomics & Antimicrobial Surveillance</p>
          <p class="bio">Specializing in high-throughput metagenomic surveillance, antimicrobial resistance dynamics, and wastewater genomics. Committed to building an open, reproducible, and publisher-independent platform for global pathogen researchers.</p>
        </div>
      </div>

      <h3>Editorial Governance</h3>
      <p>The Journal of MetaResistome adheres strictly to the principles of the Committee on Publication Ethics (COPE). The editorial board operates with absolute editorial independence, ensuring decisions are determined entirely by scientific rigor, ethical compliance, and empirical validity.</p>

      <h3>Sections & Subject Editors</h3>
      <div class="editorial-grid">
        <div class="board-column">
          <h5>Metagenomics & Wastewater Surveillance</h5>
          <p class="board-member"><strong>Section Editors:</strong> To be announced in inaugural volume.</p>
          <p class="board-note">International appointments across academic research centers currently underway.</p>
        </div>
        <div class="board-column">
          <h5>Clinical Microbiology & Pathogen Genomics</h5>
          <p class="board-member"><strong>Section Editors:</strong> To be announced in inaugural volume.</p>
          <p class="board-note">Focusing on hospital-acquired infections, clinical WGS, and diagnostic pipelines.</p>
        </div>
        <div class="board-column">
          <h5>Computational Biology & Machine Learning</h5>
          <p class="board-member"><strong>Section Editors:</strong> To be announced in inaugural volume.</p>
          <p class="board-note">Focusing on ARG prediction algorithms, pipeline benchmarking, and open software.</p>
        </div>
      </div>

      <h3>Join the Editorial Review Board</h3>
      <p>Qualified researchers holding a doctoral degree in microbiology, bioinformatics, infectious diseases, or related disciplines who wish to serve as peer reviewers or associate editors are invited to express interest via <a href="mailto:editor@metaresistome.org">editor@metaresistome.org</a> with their CV and ORCID iD.</p>
    `
  },

  guideForAuthors: {
    title: "Guide for Authors",
    slug: "guide-for-authors",
    shortSummary: "Comprehensive guidelines on manuscript types, preparation instructions, reproducible bioinformatics standards, data availability requirements, and publication ethics.",
    fullText: `
      <h3>Article Categories</h3>
      <ul>
        <li><strong>Original Research Articles:</strong> Full-length empirical studies presenting novel scientific discoveries (recommended length: 3,500–6,500 words, up to 8 figures/tables).</li>
        <li><strong>Methodology & Protocol Reports:</strong> Validated wet-lab protocols, bioinformatic benchmarking studies, or software tools accompanied by open source code (recommended length: 3,000–5,000 words).</li>
        <li><strong>Review Articles & Critical Perspectives:</strong> Authoritative, comprehensive syntheses of emerging topics in AMR, pathogen surveillance, or microbial genomics (recommended length: 5,000–8,000 words).</li>
        <li><strong>Short Communications / Genome Announcements:</strong> Concise reports of novel resistance plasmids, outbreak isolates, or localized resistome datasets (up to 2,000 words, 2 figures/tables).</li>
      </ul>

      <h3>Manuscript Structure</h3>
      <p>Manuscripts must be organized into the following clear sections:</p>
      <ol>
        <li><strong>Title Page:</strong> Concise, informative title (avoid vague jargon); full author names, institutional affiliations, and corresponding author email.</li>
        <li><strong>Abstract:</strong> Structured or unstructured, maximum 250 words, summarizing background, methods, key findings, and biological significance.</li>
        <li><strong>Keywords:</strong> 4 to 6 specific keywords separated by semicolons.</li>
        <li><strong>Introduction:</strong> Scientific context, existing knowledge gaps, and stated study objectives.</li>
        <li><strong>Materials and Methods:</strong> Detailed descriptions enabling complete replication. For computational analyses, specify software versions, parameters, and repositories.</li>
        <li><strong>Results:</strong> Clear, concise presentation supported by publication-grade figures and statistical confidence intervals.</li>
        <li><strong>Discussion:</strong> Interpretation of results, contextualization within global literature, limitations, and future directions.</li>
        <li><strong>Data Availability Statement:</strong> Mandatory accession numbers (NCBI BioProject, SRA, GenBank, ENA) and code repository links (GitHub/Zenodo).</li>
        <li><strong>Funding & Competing Interests:</strong> Disclose all sources of financial support and explicit statements regarding conflicts of interest.</li>
        <li><strong>References:</strong> Complete citations formatted according to JMR bibliographic standards.</li>
      </ol>

      <h3>Reproducible Computational Standards</h3>
      <p>For papers involving genomics and metagenomics, all raw sequencing reads must be deposited in an INSDC repository (NCBI SRA, ENA, or DDBJ) prior to publication. Custom scripts and bioinformatic pipelines must be archived with a permanent DOI (e.g., via Zenodo or Figshare).</p>
    `
  },

  about: {
    title: "About the Journal",
    slug: "about",
    shortSummary: "Journal of MetaResistome is an independent scholarly publication founded to advance transparent, diamond open-access research in antimicrobial resistance biology and surveillance genomics.",
    fullText: `
      <h3>Publisher Independence & Non-Profit Ethos</h3>
      <p>The <strong>Journal of MetaResistome</strong> was established as an independent academic platform. It is not affiliated with commercial legacy publishers, ensuring that decisions are governed exclusively by active scientists and focused on research integrity rather than commercial metrics.</p>

      <h3>Open Access Policy</h3>
      <p>JMR publishes under the <strong>Creative Commons Attribution 4.0 International (CC BY 4.0)</strong> license. Authors retain copyright of their work without restriction. Anyone may freely read, download, copy, distribute, print, search, or link to the full texts of articles without prior permission from the publisher or the author.</p>

      <h3>Editorial Rigor & COPE Compliance</h3>
      <p>The journal complies with the core practices and guidelines developed by the Committee on Publication Ethics (COPE). Plagiarism screening is performed on all submissions, and all instances of scientific misconduct, duplicate publication, or author disputes are handled following COPE flowcharts.</p>
    `
  },

  contact: {
    title: "Contact & Inquiries",
    slug: "contact",
    shortSummary: "Direct contacts for editorial queries, manuscript status, peer review inquiries, and journal administration.",
    fullText: `
      <h3>Editorial Office</h3>
      <p>For scientific inquiries, prospective special issue proposals, and editorial board matters:</p>
      <p><strong>Founding Editor-in-Chief:</strong> Dr. Shafiq<br />
      <strong>Email:</strong> <a href="mailto:editor@metaresistome.org">editor@metaresistome.org</a><br />
      <strong>Affiliation:</strong> Laboratory of Pathogen Genomics & Antimicrobial Surveillance</p>

      <h3>Technical & Web Support</h3>
      <p>For website questions, DOI questions, or technical issues with article access:</p>
      <p><strong>Email:</strong> <a href="mailto:support@metaresistome.org">support@metaresistome.org</a></p>

      <h3>Response Commitment</h3>
      <p>The editorial team aims to reply to all formal scholarly inquiries within 2 to 3 business days.</p>
    `
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JOURNAL_CONTENT };
}
