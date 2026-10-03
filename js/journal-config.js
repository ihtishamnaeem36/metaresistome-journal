/**
 * Journal of MetaResistome (JMR) - Configuration & Feature Flags
 * 
 * SINGLE SOURCE OF TRUTH FOR JOURNAL ATTRIBUTES
 * 
 * RULES:
 * - A metric/badge/button renders ONLY if its value is non-null AND non-empty.
 * - When null, the slot is NOT rendered at all  -  no empty box, no "N/A", no placeholder text.
 * - The surrounding layout does NOT shift or break when a field becomes visible.
 * 
 * To enable metrics later (e.g. Impact Factor or ISSN):
 * Simply set the value here (e.g. impactFactor: 4.8). No layout or CSS changes required!
 */

const JOURNAL_SETTINGS = {
  // Identity
  title: "Journal of MetaResistome",
  abbreviation: "JMR",
  subtitle: "An International Journal of Antimicrobial Resistance, Pathogen Genomics & Microbial Surveillance",
  tagline: "Peer-reviewed, open-access scholarly research advancing global pathogen intelligence and resistance biology.",
  establishedYear: 2026,
  publisherNote: "An independent academic publication dedicated to rigorous scientific discovery.",
  
  // Editorial Leadership
  editorInChief: "Dr. Shafiq",
  editorInChiefTitle: "Founding Editor-in-Chief",
  editorInChiefAffiliation: "Laboratory of Pathogen Genomics & Antimicrobial Surveillance",
  editorInChiefPhoto: "manus-storage/dr-shafiq-microbiology-lab-portrait_6437b0f3.webp",
  contactEmail: "editor@metaresistome.org",
  
  // Feature-flagged metrics (NULL by default for early-stage journal - NO FAKE METRICS)
  issn: null,               // e.g. "2994-XXXX" when registered
  eissn: null,              // e.g. "2994-YYYY" when registered
  impactFactor: null,       // e.g. 4.8 when calculated (hidden until set)
  citeScore: null,          // e.g. 5.1 when calculated (hidden until set)
  acceptanceRate: null,     // e.g. "24%" when established (hidden until set)
  publishingModel: "Hybrid (CC BY 4.0 or Subscription)",
  publicationFrequency: "Continuous Publication (Annual Volumes, Quarterly Issues)",
  apc: "Hybrid Model: Zero fee for Subscription; Optional Open Access available",
  
  // Indexing badges (hidden until officially indexed)
  indexingBadges: [],       // e.g. ["Scopus", "DOAJ", "PubMed Central", "Crossref"]
  
  // System Feature Flags
  submissionLive: true,     // Manuscript submission portal is active
  submissionPortalUrl: "submit.html", // Dedicated Elsevier-style submission system
  
  // Article counts & flags
  articlesInPressCount: 0,  // Hidden if 0
  publishedArticlesCount: 0 // Hidden if 0
};

// Export for browser global and modular usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JOURNAL_SETTINGS };
}
