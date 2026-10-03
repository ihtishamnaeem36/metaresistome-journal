#  Journal of MetaResistome (JMR)  -  Launching & Custom Domain Guide

This document contains the complete step-by-step instructions to connect your **Porkbun `.com` domain** to your **GitHub Pages** website, invite collaborators/editors, and manage daily updates.

---

##  PART 1: Connect Your Porkbun `.com` Domain to GitHub Pages

Once this one-time setup is complete, visitors who type your `.com` address will see your website directly with full SSL/HTTPS security (). You will never see `github.io` in the address bar.

### Step 1.1: Tell GitHub Your Domain Name
1. Open your repository Pages settings:  
    **[https://github.com/ihtishamnaeem36/metaresistome-journal/settings/pages](https://github.com/ihtishamnaeem36/metaresistome-journal/settings/pages)**
2. Under **Build and deployment**:
   * **Source:** Select `Deploy from a branch`
   * **Branch:** Select `main`
   * **Folder:** Select `/ (root)`
   * Click **Save**.
3. Scroll down to the **Custom domain** section.
4. Type your domain name (e.g. `metaresistome.com`).
5. Click **Save**.

---

### Step 1.2: Add DNS Records in Porkbun
1. Log into your Porkbun account:  
    **[https://porkbun.com/account/domainsSpeedy](https://porkbun.com/account/domainsSpeedy)**
2. Find your domain and click the **DNS** button next to it.
3. If there are any default parking or old Netlify records, delete them so there are no conflicts.
4. Add the following **4 "A" Records** (points your root domain to GitHub’s global servers):

| Record Type | Host | Answer / IP Address | TTL |
| :--- | :--- | :--- | :--- |
| **A** | *(leave blank or `@`)* | `185.199.108.153` | `600` |
| **A** | *(leave blank or `@`)* | `185.199.109.153` | `600` |
| **A** | *(leave blank or `@`)* | `185.199.110.153` | `600` |
| **A** | *(leave blank or `@`)* | `185.199.111.153` | `600` |

5. Add **1 "CNAME" Record** (so visitors who type `www.yourdomain.com` are routed correctly):

| Record Type | Host | Answer | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `ihtishamnaeem36.github.io` | `600` |

6. Click **Save / Submit** in Porkbun.

---

### Step 1.3: Enable Free Security Certificate (HTTPS )
1. Wait **10 to 15 minutes** for DNS records to propagate across the internet.
2. Return to your [GitHub Pages Settings](https://github.com/ihtishamnaeem36/metaresistome-journal/settings/pages).
3. Under **Custom domain**, check the box: **"Enforce HTTPS"**.
4. Your website is now live worldwide on your `.com` domain with full SSL security!

---

##  PART 2: Invite the Editor with Full Developer Permissions

Both you and the editor can collaborate directly on the same repository without switching accounts:

1. Open your repository Collaborators settings:  
    **[https://github.com/ihtishamnaeem36/metaresistome-journal/settings/access](https://github.com/ihtishamnaeem36/metaresistome-journal/settings/access)**
2. Click the green **"Add people"** button.
3. Enter the editor's **GitHub username or email**.
4. Select their role:
   * **Admin:** Full control (manage settings + push code).
   * **Write:** Developer access (can push updates, edit code, and create branches).
5. Click **"Add to this repository"**.
6. The editor will receive an email invitation to accept. Once accepted, they can push code from their computer just like you.

---

##  PART 3: Daily Development & Updating Workflow

Whenever you or the editor want to update the journal:

### 1. Test Locally on Your Laptop
Run your local server:
```powershell
python -m http.server 8088
```
Open your browser to: **`http://localhost:8088`**  
Make your changes, edit articles, or update information with AI and preview immediately.

### 2. Push Live with One Command
When you are satisfied with the preview, open PowerShell in the project folder and run:
```powershell
git add .
git commit -m "Update journal content"
git push
```
GitHub Pages will automatically update your live `.com` website in **15–30 seconds**.

---

##  PART 4: Adding Impact Factor, CiteScore, or ISSN Later

Per our architecture rules, the platform has a **strict feature-flag system** in `js/journal-config.js`.

* Metrics and badges that are `null` are **100% invisible** with zero empty boxes and zero layout shift.
* When your official ISSN or Impact Factor is issued, **you do not touch any HTML or CSS**.

Simply open `js/journal-config.js` and update the value:
```javascript
const JOURNAL_SETTINGS = {
  // Change null to your official values:
  issn: "2994-XXXX",       // Auto-appears in masthead
  impactFactor: 4.8,       // Auto-appears in metrics bar
  citeScore: 5.1,          // Auto-appears in metrics bar
  submissionLive: true     // Reveals the "Submit Paper" button
};
```
Save the file, run `git push`, and the new badges will render seamlessly on your live site!

---

##  Quick Links Reference

* **GitHub Repository:** [https://github.com/ihtishamnaeem36/metaresistome-journal](https://github.com/ihtishamnaeem36/metaresistome-journal)
* **GitHub Pages Settings:** [https://github.com/ihtishamnaeem36/metaresistome-journal/settings/pages](https://github.com/ihtishamnaeem36/metaresistome-journal/settings/pages)
* **Collaborator Settings:** [https://github.com/ihtishamnaeem36/metaresistome-journal/settings/access](https://github.com/ihtishamnaeem36/metaresistome-journal/settings/access)
* **Porkbun DNS Manager:** [https://porkbun.com/account/domainsSpeedy](https://porkbun.com/account/domainsSpeedy)
