# Journal of MetaResistome (JMR)

**An International Journal of Antimicrobial Resistance, Pathogen Genomics & Microbial Surveillance**

An independent, peer-reviewed Diamond Open Access scholarly journal platform built according to modern information architecture, rigorous academic typography, and WCAG accessibility standards.

---

##  Core Principles & Architecture

1. **Independent Scholarly Identity:** Designed strictly as an authoritative academic publication with restrained typography (`Source Serif 4` + `Inter`), high-contrast hierarchy, and no startup/marketing fluff.
2. **Every Button & Link Works:** Zero dead links, zero 404s, and zero "coming soon" placeholders.
3. **Open in New Tab Compatible:** All primary navigation links and article anchors use native `<a href="...">` tags. Right-click → "Open in new tab", middle-click, and Ctrl/Cmd+click work natively.
4. **Dual-Pattern Navigation:**
   * Homepage previews open in an accessible modal drawer (`Radix Dialog` style).
   * Inside the modal, an `"Open full page ↗"` link navigates to the dedicated full-page route (`aims-and-scope.html`, `editorial-board.html`, `guide-for-authors.html`, etc.).
   * Both paths render from the **same single source of truth** (`js/journal-content.js`).
5. **Portability:** All assets and references use clean relative paths. You can move this entire folder to any computer or directory, and it runs identically without any configuration.

---

##  How to Enable Impact Factor, CiteScore & Indexing Badges (Zero Code Change Required)

The journal platform includes a **strict feature-flag system** in `js/journal-config.js`.

> [!IMPORTANT]
> **Rule:** If a metric, badge, or ISSN is `null` or empty, the entire UI slot is **completely hidden** with zero empty boxes and zero layout shift.
> 
> **To enable Impact Factor display:**  
> Simply open `js/journal-config.js` and set:  
> `impactFactor: 4.2`  
> *(No CSS, layout, or HTML change required!)*

```javascript
const JOURNAL_SETTINGS = {
  title: "Journal of MetaResistome",
  abbreviation: "JMR",
  establishedYear: 2026,
  
  // Update these values as official registrations arrive:
  issn: null,           // e.g., "2994-XXXX"
  eissn: null,          // e.g., "2994-YYYY"
  impactFactor: null,   // e.g., 4.2 (auto-renders in masthead when non-null)
  citeScore: null,      // e.g., 5.1 (auto-renders in masthead when non-null)
  acceptanceRate: null, // e.g., "24%"
  
  // Editorial flags
  submissionLive: false // When set to true, "Submit Paper" CTA appears in navigation
};
```

---

##  Repository Structure

```
├── index.html              # Main journal homepage (masthead, CFP, previews, footer)
├── aims-and-scope.html     # Dedicated full page for scientific scope & mission
├── editorial-board.html    # Dedicated full page for editorial governance & board
├── guide-for-authors.html  # Dedicated full page for author manuscript guidelines
├── about.html              # Dedicated full page for publishing ethics & open access
├── contact.html            # Dedicated full page for editorial office contacts
├── articles.html           # Published articles & call for inaugural papers
├── issues.html             # Volume & Issue archive (Volume 1, 2026)
├── 404.html                # Academic fallback page for GitHub Pages
├── robots.txt              # Search engine & Google Scholar crawler directives
├── sitemap.xml             # XML sitemap for scholarly indexing
├── css/
│   └── journal.css         # Academic design system & typography tokens
├── js/
│   ├── journal-config.js   # Single source of truth for settings & feature flags
│   ├── journal-content.js  # Unified content for modals and full pages
│   └── journal-engine.js   # Runtime logic (modals, search, feature-flag rendering)
└── manus-storage/          # Official figures, marks, and editorial portraits
```

---

##  Local Development & Preview

To preview the website locally on any machine:
1. Open PowerShell or Terminal in this folder.
2. Run:
   ```bash
   python -m http.server 8088
   ```
3. Open your browser to `http://localhost:8088`.

---

##  Deploying to GitHub Pages & Custom Domain (Porkbun)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initialize Journal of MetaResistome platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/metaresistome-journal.git
   git push -u origin main
   ```
2. **Enable GitHub Pages:**
   * Go to repository **Settings** → **Pages**.
   * Under **Branch**, select `main` and folder `/ (root)`. Click **Save**.
3. **Attach Custom Domain (e.g. metaresistome.org):**
   * Under **Custom domain**, enter your domain name.
   * In Porkbun DNS, add an **A Record** pointing `@` to GitHub's IPs:
     * `185.199.108.153`
     * `185.199.109.153`
     * `185.199.110.153`
     * `185.199.111.153`
   * Check **Enforce HTTPS** in GitHub Pages settings.
