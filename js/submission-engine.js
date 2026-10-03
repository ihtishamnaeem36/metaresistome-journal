/**
 * Journal of MetaResistome (JMR) - Editorial Submission System Runtime
 * Elsevier / Aries Editorial Manager-Inspired Scholarly Submission Portal
 */

(function () {
  'use strict';

  // Comprehensive global scholarly institutions list for fast autocomplete search
  const INSTITUTIONS_DB = [
    { name: "University of Oxford", country: "United Kingdom" },
    { name: "University of Cambridge", country: "United Kingdom" },
    { name: "Imperial College London", country: "United Kingdom" },
    { name: "University College London (UCL)", country: "United Kingdom" },
    { name: "London School of Hygiene & Tropical Medicine (LSHTM)", country: "United Kingdom" },
    { name: "Wellcome Sanger Institute", country: "United Kingdom" },
    { name: "University of Edinburgh", country: "United Kingdom" },
    { name: "University of Manchester", country: "United Kingdom" },
    { name: "King's College London", country: "United Kingdom" },
    { name: "Harvard University", country: "United States" },
    { name: "Massachusetts Institute of Technology (MIT)", country: "United States" },
    { name: "Stanford University", country: "United States" },
    { name: "Johns Hopkins University", country: "United States" },
    { name: "University of California, Berkeley", country: "United States" },
    { name: "University of California, San Francisco (UCSF)", country: "United States" },
    { name: "Yale University", country: "United States" },
    { name: "Columbia University", country: "United States" },
    { name: "National Institutes of Health (NIH)", country: "United States" },
    { name: "Centers for Disease Control and Prevention (CDC)", country: "United States" },
    { name: "University of Toronto", country: "Canada" },
    { name: "McGill University", country: "Canada" },
    { name: "University of British Columbia", country: "Canada" },
    { name: "Karolinska Institute", country: "Sweden" },
    { name: "Max Planck Institute", country: "Germany" },
    { name: "Charite - Universitatsmedizin Berlin", country: "Germany" },
    { name: "Institut Pasteur", country: "France" },
    { name: "ETH Zurich", country: "Switzerland" },
    { name: "University of Zurich", country: "Switzerland" },
    { name: "World Health Organization (WHO)", country: "Switzerland" },
    { name: "National University of Singapore (NUS)", country: "Singapore" },
    { name: "Nanyang Technological University (NTU)", country: "Singapore" },
    { name: "Peking University", country: "China" },
    { name: "Tsinghua University", country: "China" },
    { name: "The University of Tokyo", country: "Japan" },
    { name: "Kyoto University", country: "Japan" },
    { name: "University of Melbourne", country: "Australia" },
    { name: "The University of Sydney", country: "Australia" },
    { name: "University of Queensland", country: "Australia" }
  ];

  // Comprehensive global countries list for autocomplete search
  const COUNTRIES_DB = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Chile", "China", 
    "Colombia", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", 
    "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Fiji", "Finland", "France", 
    "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong", "Hungary", 
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", 
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", 
    "Luxembourg", "Malaysia", "Maldives", "Mali", "Malta", "Mexico", "Moldova", "Monaco", 
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", 
    "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", 
    "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", 
    "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", 
    "Zambia", "Zimbabwe"
  ];

  // Common stop words to filter out for keyword density calculation
  const STOP_WORDS = new Set([
    "a", "about", "above", "across", "after", "again", "against", "all", "almost", "alone", 
    "along", "already", "also", "although", "always", "among", "an", "and", "another", 
    "any", "anybody", "anyone", "anything", "anywhere", "are", "area", "areas", "around", 
    "as", "at", "away", "b", "back", "be", "became", "because", "become", "becomes", "been", 
    "before", "began", "behind", "being", "beings", "best", "better", "between", "big", "both", 
    "but", "by", "c", "came", "can", "cannot", "case", "cases", "certain", "certainly", "clear", 
    "clearly", "come", "could", "d", "did", "differ", "different", "do", "does", "done", 
    "down", "during", "e", "each", "early", "either", "end", "enough", "even", "ever", 
    "every", "everybody", "everyone", "everything", "everywhere", "f", "fact", "facts", "far", 
    "few", "fewer", "find", "finds", "first", "for", "four", "from", "full", "further", 
    "g", "gave", "general", "generally", "get", "gets", "give", "given", "gives", "go", 
    "going", "good", "got", "great", "greater", "greatest", "group", "groups", "h", "had", 
    "has", "have", "having", "he", "her", "here", "herself", "high", "higher", "highest", 
    "him", "himself", "his", "how", "however", "i", "if", "important", "in", "into", "is", 
    "it", "its", "itself", "j", "just", "k", "keep", "keeps", "kind", "knew", "know", 
    "known", "knows", "l", "large", "largely", "last", "later", "latest", "least", "less", 
    "let", "lets", "like", "likely", "long", "longer", "longest", "m", "made", "make", 
    "making", "many", "may", "me", "member", "members", "might", "more", "most", "mostly", 
    "mr", "mrs", "much", "must", "my", "myself", "n", "necessary", "need", "needed", 
    "needs", "never", "new", "newer", "newest", "next", "no", "nobody", "non", "not", 
    "nothing", "now", "nowhere", "number", "numbers", "o", "of", "off", "often", "old", 
    "on", "once", "one", "only", "open", "or", "order", "other", "others", "our", "out", 
    "over", "p", "part", "per", "place", "point", "possible", "present", "presented", "presents", 
    "put", "q", "quite", "r", "rather", "really", "right", "s", "said", "same", "saw", 
    "say", "says", "second", "seconds", "see", "seem", "seemed", "seems", "several", 
    "shall", "she", "should", "show", "showed", "showing", "shows", "side", "sides", 
    "since", "small", "so", "some", "someone", "something", "somewhere", "state", "states", 
    "still", "such", "sure", "t", "take", "taken", "than", "that", "the", "their", "them", 
    "then", "there", "therefore", "these", "they", "thing", "things", "think", "thinks", 
    "this", "those", "though", "thought", "three", "through", "thus", "to", "together", 
    "too", "took", "toward", "turn", "two", "u", "under", "until", "up", "upon", "us", 
    "use", "used", "uses", "using", "v", "very", "w", "want", "wanted", "wants", "was", 
    "way", "ways", "we", "well", "went", "were", "what", "when", "where", "whether", 
    "which", "while", "who", "whole", "whose", "why", "will", "with", "within", "without", 
    "work", "worked", "working", "works", "would", "x", "y", "year", "years", "yet", 
    "you", "your", "yours", "z"
  ]);

  const DRAFT_STORAGE_KEY = 'jmr_submission_draft';
  let currentDensityNgram = 1;

  // State Store
  const submissionState = {
    currentStep: 1,
    articleType: 'original-research',
    files: [], // Array of { id, itemType, file, name, size, type, timestamp }
    metadata: {
      title: '',
      abstract: '',
      keywords: '',
      section: 'AMR Genomics & Resistome Profiling',
      priorSubmission: 'no',
      priorDetails: '',
      coi: 'no',
      coiDetails: '',
      funding: '',
      ethics: 'na',
      ethicsDetails: '',
      dataAvailability: ''
    },
    authors: [
      {
        id: 'auth_1',
        prefix: 'Dr.',
        firstName: '',
        middleName: '',
        familyName: '',
        email: '',
        institution: '',
        country: '',
        orcid: '',
        isCorresponding: true
      }
    ],
    publishingModel: 'open-access',
    submissionId: null
  };

  // Item Definitions & Ordering priority
  const ITEM_DEFINITIONS = {
    cover_letter: {
      name: 'Cover Letter',
      badgeClass: 'badge-cover',
      isSingle: true,
      required: true,
      rank: 1,
      description: 'Confidential letter to Editor-in-Chief highlighting originality, significance, and ethical compliance.'
    },
    title_page: {
      name: 'Title Page',
      badgeClass: 'badge-titlepage',
      isSingle: true,
      required: false,
      rank: 2,
      description: 'Optional separate title page containing author details, affiliations, and acknowledgments.'
    },
    manuscript: {
      name: 'Manuscript File',
      badgeClass: 'badge-manuscript',
      isSingle: true,
      required: true,
      rank: 3,
      description: 'Complete text document (.docx, .pdf, or .odt) including Introduction, Methods, Results, Discussion, and References.'
    },
    figure: {
      name: 'Figure',
      badgeClass: 'badge-figure',
      isSingle: false,
      required: false,
      rank: 4,
      description: 'High-resolution image (.png, .jpg, .tif, .eps). Multiple figures permitted.'
    },
    table: {
      name: 'Table',
      badgeClass: 'badge-table',
      isSingle: false,
      required: false,
      rank: 5,
      description: 'Data tables (.docx, .xlsx). Multiple tables permitted.'
    },
    graphical_abstract: {
      name: 'Graphical Abstract',
      badgeClass: 'badge-graphical',
      isSingle: true,
      required: false,
      rank: 6,
      description: 'Visual summary diagram illustrating primary findings.'
    },
    supplementary: {
      name: 'Supplementary Material',
      badgeClass: 'badge-supplementary',
      isSingle: false,
      required: false,
      rank: 7,
      description: 'Supplementary datasets, primers, trees, or scripts (.pdf, .zip, .xlsx, .fasta). Multiple files permitted.'
    }
  };

  // DOM Ready
  document.addEventListener('DOMContentLoaded', initSubmissionPortal);

  function initSubmissionPortal() {
    setupStepNavigation();
    setupArticleTypeSelection();
    setupFileUploadSystem();
    setupDeclarationsAndForm();
    setupKeywordDensitySystem();
    setupAuthorManagement();
    setupHybridModelSelection();
    setupSubmissionReview();
    setupDraftControls();
    loadDraftFromStorage();
    updateValidationIndicators();
  }

  /* ===========================================
     1. STEP NAVIGATION
     =========================================== */
  function setupStepNavigation() {
    const prevBtns = document.querySelectorAll('.btn-em-prev');
    const nextBtns = document.querySelectorAll('.btn-em-next');
    const stepNodes = document.querySelectorAll('.step-node');

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (submissionState.currentStep > 1) {
          goToStep(submissionState.currentStep - 1);
        }
      });
    });

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateCurrentStep(submissionState.currentStep)) {
          if (submissionState.currentStep < 5) {
            goToStep(submissionState.currentStep + 1);
          }
        }
      });
    });

    stepNodes.forEach(node => {
      node.addEventListener('click', () => {
        const targetStep = parseInt(node.getAttribute('data-step'), 10);
        if (targetStep < submissionState.currentStep) {
          goToStep(targetStep);
        } else if (canNavigateToStep(targetStep)) {
          goToStep(targetStep);
        }
      });
    });
  }

  function canNavigateToStep(targetStep) {
    for (let s = 1; s < targetStep; s++) {
      if (!validateCurrentStep(s, false)) return false;
    }
    return true;
  }

  function goToStep(stepNumber) {
    submissionState.currentStep = stepNumber;

    document.querySelectorAll('.submission-step-card').forEach(card => {
      card.classList.remove('active');
    });
    const activeCard = document.getElementById(`step-card-${stepNumber}`);
    if (activeCard) {
      activeCard.classList.add('active');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    document.querySelectorAll('.step-node').forEach(node => {
      const step = parseInt(node.getAttribute('data-step'), 10);
      node.classList.remove('active', 'completed');
      if (step === stepNumber) {
        node.classList.add('active');
      } else if (step < stepNumber) {
        node.classList.add('completed');
      }
    });

    document.querySelectorAll('.step-connector').forEach((conn, index) => {
      conn.classList.remove('completed');
      if (index + 1 < stepNumber) {
        conn.classList.add('completed');
      }
    });

    if (stepNumber === 4) {
      renderReviewSummary();
    }

    updateValidationIndicators();
    saveDraftToStorage();
  }

  function validateCurrentStep(stepNumber, showAlert = true) {
    if (stepNumber === 1) {
      if (!submissionState.articleType) {
        if (showAlert) alert('Please select an article type to proceed.');
        return false;
      }
      return true;
    }

    if (stepNumber === 2) {
      const hasCover = submissionState.files.some(f => f.itemType === 'cover_letter');
      const hasManuscript = submissionState.files.some(f => f.itemType === 'manuscript');

      if (!hasCover || !hasManuscript) {
        if (showAlert) {
          const missing = [];
          if (!hasCover) missing.push('Cover Letter');
          if (!hasManuscript) missing.push('Manuscript File');
          alert(`Required files missing: ${missing.join(' and ')}. Both are mandatory to proceed.`);
        }
        return false;
      }
      return true;
    }

    if (stepNumber === 3) {
      saveFormDataToState();
      if (!submissionState.metadata.title.trim()) {
        if (showAlert) alert('Please enter the manuscript title.');
        document.getElementById('input-title')?.focus();
        return false;
      }
      if (!submissionState.metadata.abstract.trim()) {
        if (showAlert) alert('Please enter the manuscript abstract.');
        document.getElementById('input-abstract')?.focus();
        return false;
      }
      if (!submissionState.metadata.keywords.trim()) {
        if (showAlert) alert('Please enter 3 to 6 keywords separated by semicolons (;).');
        document.getElementById('input-keywords')?.focus();
        return false;
      }

      // Check author validity
      for (let i = 0; i < submissionState.authors.length; i++) {
        const a = submissionState.authors[i];
        if (!a.firstName.trim() || !a.familyName.trim() || !a.email.trim() || !a.institution.trim()) {
          if (showAlert) alert(`Please complete the required fields (First Name, Family Name, Email, and Institution) for Author ${i + 1}.`);
          return false;
        }
      }

      // Ensure at least one author is marked as corresponding
      const hasCorresponding = submissionState.authors.some(a => a.isCorresponding);
      if (!hasCorresponding) {
        submissionState.authors[0].isCorresponding = true;
      }

      return true;
    }

    return true;
  }

  /* ===========================================
     2. ARTICLE TYPE SELECTION (List Design)
     =========================================== */
  function setupArticleTypeSelection() {
    const rows = document.querySelectorAll('.article-type-row');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        rows.forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const radio = row.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        submissionState.articleType = row.getAttribute('data-type');
        updateValidationIndicators();
        saveDraftToStorage();
      });
    });
  }

  /* ===========================================
     3. FILE UPLOADS, REORDERING & TEXT EXTRACTION
     =========================================== */
  function setupFileUploadSystem() {
    const itemSelect = document.getElementById('item-type-select');
    const helperText = document.getElementById('item-helper-text');
    const singleAlert = document.getElementById('single-file-alert');
    const alertMessage = document.getElementById('single-file-alert-msg');
    const dropzone = document.getElementById('dropzone-area');
    const fileInput = document.getElementById('file-upload-input');
    const reorderBtn = document.getElementById('btn-reorder-files');

    if (!itemSelect || !dropzone || !fileInput) return;

    itemSelect.addEventListener('change', () => {
      const selectedType = itemSelect.value;
      const def = ITEM_DEFINITIONS[selectedType];
      if (def && helperText) {
        helperText.textContent = `${def.description} ${def.isSingle ? '(Single file category)' : '(Multiple files allowed)'}`;
      }
      checkSingleFileConflict(selectedType);
    });

    function checkSingleFileConflict(selectedType) {
      const def = ITEM_DEFINITIONS[selectedType];
      if (def && def.isSingle) {
        const existing = submissionState.files.find(f => f.itemType === selectedType);
        if (existing) {
          alertMessage.innerHTML = `<strong>Notice:</strong> You have already uploaded a <u>${def.name}</u> (<em>${escapeHtml(existing.name)}</em>). This category accepts only one file. To upload a different version, click the <strong>Remove</strong> button next to the existing file in the table below before attaching a new file.`;
          singleAlert.classList.add('is-visible');
          return true;
        }
      }
      singleAlert.classList.remove('is-visible');
      return false;
    }

    // Reorder files button
    if (reorderBtn) {
      reorderBtn.addEventListener('click', () => {
        reorderFilesToStandardSequence();
      });
    }

    // Drag and drop handlers
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleIncomingFiles(droppedFiles);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (fileInput.files.length > 0) {
        handleIncomingFiles(fileInput.files);
        fileInput.value = '';
      }
    });

    async function handleIncomingFiles(fileList) {
      const selectedType = itemSelect.value;
      const def = ITEM_DEFINITIONS[selectedType];
      if (!def) return;

      if (def.isSingle) {
        const existing = submissionState.files.find(f => f.itemType === selectedType);
        if (existing) {
          alertMessage.innerHTML = `<strong>Notice:</strong> You have already uploaded a <u>${def.name}</u> (<em>${escapeHtml(existing.name)}</em>). To replace it, please first remove the existing file using the <strong>Remove</strong> button in the table below.`;
          singleAlert.classList.add('is-visible');
          return;
        }
      }

      for (let file of Array.from(fileList)) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        const isDoc = ['.doc', '.docx', '.odt', '.rtf'].includes(ext);

        // Figures and Graphical Abstracts MUST NOT accept Word documents
        if ((selectedType === 'figure' || selectedType === 'graphical_abstract') && isDoc) {
          alertMessage.innerHTML = `<strong>Invalid File Format:</strong> Word documents (<em>${escapeHtml(file.name)}</em>) are not permitted for <u>${def.name}</u>. Please upload high-resolution images (.png, .jpg, .tif, .svg) or vector PDF files.`;
          singleAlert.classList.add('is-visible');
          continue;
        }

        if (def.isSingle && submissionState.files.some(f => f.itemType === selectedType)) {
          break;
        }

        const fileRecord = {
          id: 'file_' + Math.random().toString(36).substr(2, 9),
          itemType: selectedType,
          file: file,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          timestamp: new Date().toISOString()
        };

        submissionState.files.push(fileRecord);

        // If manuscript file, attempt automatic title, abstract & keywords extraction
        if (selectedType === 'manuscript') {
          extractTitleAndAbstractFromManuscript(file);
        }
      }

      singleAlert.classList.remove('is-visible');
      renderFilesTable();
      updateValidationIndicators();
      saveDraftToStorage();
    }
  }

  // Automatic Reorder Files to Standard Scholarly Sequence
  function reorderFilesToStandardSequence() {
    submissionState.files.sort((a, b) => {
      const rankA = ITEM_DEFINITIONS[a.itemType]?.rank || 99;
      const rankB = ITEM_DEFINITIONS[b.itemType]?.rank || 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    renderFilesTable();
    const summarySpan = document.getElementById('files-count-summary');
    if (summarySpan) {
      summarySpan.textContent = 'Files sorted to journal standard sequence';
      setTimeout(() => {
        summarySpan.textContent = `${submissionState.files.length} file${submissionState.files.length > 1 ? 's' : ''} attached`;
      }, 2500);
    }
    saveDraftToStorage();
  }

  // Extract Title, Abstract, and Keywords from .docx or .txt manuscript
  async function extractTitleAndAbstractFromManuscript(file) {
    try {
      const fileName = file.name.toLowerCase();
      let rawText = '';

      if (fileName.endsWith('.docx') && typeof JSZip !== 'undefined') {
        const zip = await JSZip.loadAsync(file);
        const docXml = await zip.file('word/document.xml')?.async('text');
        if (docXml) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(docXml, 'text/xml');
          const pElements = xmlDoc.getElementsByTagName('w:p');
          const paragraphs = [];
          for (let i = 0; i < pElements.length; i++) {
            const textNodes = pElements[i].getElementsByTagName('w:t');
            let pText = '';
            for (let j = 0; j < textNodes.length; j++) {
              pText += textNodes[j].textContent;
            }
            pText = pText.trim();
            if (pText) paragraphs.push(pText);
          }
          rawText = paragraphs.join('\n\n');
        }
      } else if (fileName.endsWith('.txt')) {
        rawText = await file.text();
      }

      if (!rawText) return;

      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      // Candidate Title: First substantive line between 15 and 300 characters
      let candidateTitle = '';
      for (let line of lines.slice(0, 5)) {
        if (line.length >= 15 && line.length <= 300 && !line.toLowerCase().startsWith('page')) {
          candidateTitle = line;
          break;
        }
      }

      // Candidate Abstract: Search for "Abstract" or "Summary" header
      let candidateAbstract = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^(abstract|summary):?/i.test(line)) {
          const abstractParas = [];
          let startText = line.replace(/^(abstract|summary):?/i, '').trim();
          if (startText) abstractParas.push(startText);

          for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
            const nextLine = lines[j];
            if (/^(keywords|key words|index terms|1\.\s*introduction|introduction):?/i.test(nextLine)) {
              break;
            }
            abstractParas.push(nextLine);
          }
          candidateAbstract = abstractParas.join(' ');
          break;
        }
      }

      // Candidate Keywords: Search for "Keywords:" or "Key words:" line
      let candidateKeywords = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^(keywords|key words|index terms):?/i.test(line)) {
          const rawKw = line.replace(/^(keywords|key words|index terms):?/i, '').trim();
          if (rawKw) {
            const terms = rawKw.split(/[,;•\n]/).map(t => t.trim()).filter(t => t.length > 2);
            if (terms.length > 0) {
              candidateKeywords = terms.join('; ');
              break;
            }
          }
        }
      }

      // Pre-fill inputs if found and user hasn't typed their own yet
      let populated = false;
      const titleInput = document.getElementById('input-title');
      const abstractInput = document.getElementById('input-abstract');
      const keywordsInput = document.getElementById('input-keywords');
      const statusBanner = document.getElementById('extraction-status-banner');

      if (candidateTitle && titleInput && !titleInput.value.trim()) {
        titleInput.value = candidateTitle;
        submissionState.metadata.title = candidateTitle;
        populated = true;
      }

      if (candidateAbstract && abstractInput && !abstractInput.value.trim()) {
        abstractInput.value = candidateAbstract;
        submissionState.metadata.abstract = candidateAbstract;
        updateAbstractWordCountAndDensity(candidateAbstract);
        populated = true;
      }

      if (candidateKeywords && keywordsInput && !keywordsInput.value.trim()) {
        keywordsInput.value = candidateKeywords;
        submissionState.metadata.keywords = candidateKeywords;
        populated = true;
      }

      if (populated) {
        if (statusBanner) {
          statusBanner.innerHTML = `<span class="extracted-notice-pill">Metadata (Title, Abstract, Keywords) extracted from manuscript file. You can review or edit below.</span>`;
          statusBanner.style.display = 'block';
        }
        saveDraftToStorage();
      }
    } catch (err) {
      console.warn('Metadata extraction notice:', err);
    }
  }

  function renderFilesTable() {
    const tableBody = document.getElementById('files-table-body');
    const emptyPlaceholder = document.getElementById('empty-files-placeholder');
    const tableContainer = document.getElementById('files-table-container');
    const summarySpan = document.getElementById('files-count-summary');

    if (!tableBody) return;

    if (submissionState.files.length === 0) {
      tableBody.innerHTML = '';
      if (emptyPlaceholder) emptyPlaceholder.style.display = 'block';
      if (tableContainer) tableContainer.style.display = 'none';
      if (summarySpan) summarySpan.textContent = '0 files attached';
      return;
    }

    if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
    if (summarySpan) {
      summarySpan.textContent = `${submissionState.files.length} file${submissionState.files.length > 1 ? 's' : ''} attached`;
    }

    tableBody.innerHTML = submissionState.files.map((fileObj) => {
      const def = ITEM_DEFINITIONS[fileObj.itemType] || { name: fileObj.itemType, badgeClass: 'badge-supplementary' };
      const formattedSize = formatBytes(fileObj.size);

      return `
        <tr>
          <td>
            <span class="item-badge ${def.badgeClass}">${def.name}</span>
          </td>
          <td>
            <strong>${escapeHtml(fileObj.name)}</strong>
          </td>
          <td style="color: var(--em-muted); font-size: 0.8rem;">
            ${formattedSize}
          </td>
          <td>
            <span style="color: var(--em-success); font-weight: 600; font-size: 0.8rem;">Ready</span>
          </td>
          <td style="text-align: right;">
            <button type="button" class="btn-remove-file" data-file-id="${fileObj.id}" title="Remove file">
              x Remove
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.querySelectorAll('.btn-remove-file').forEach(btn => {
      btn.addEventListener('click', () => {
        const fileId = btn.getAttribute('data-file-id');
        removeFile(fileId);
      });
    });
  }

  function removeFile(fileId) {
    const removedIndex = submissionState.files.findIndex(f => f.id === fileId);
    if (removedIndex !== -1) {
      const removed = submissionState.files[removedIndex];
      submissionState.files.splice(removedIndex, 1);

      const itemSelect = document.getElementById('item-type-select');
      if (itemSelect && itemSelect.value === removed.itemType) {
        document.getElementById('single-file-alert')?.classList.remove('is-visible');
      }

      renderFilesTable();
      updateValidationIndicators();
      saveDraftToStorage();
    }
  }

  function updateValidationIndicators() {
    const hasCover = submissionState.files.some(f => f.itemType === 'cover_letter');
    const hasManuscript = submissionState.files.some(f => f.itemType === 'manuscript');

    const checkCover = document.getElementById('check-item-cover');
    const checkManuscript = document.getElementById('check-item-manuscript');
    const nextBtnStep2 = document.getElementById('btn-next-step-2');

    if (checkCover) {
      checkCover.className = `check-item ${hasCover ? 'valid' : 'invalid'}`;
      checkCover.textContent = `Cover Letter: ${hasCover ? 'Attached' : 'Required'}`;
    }

    if (checkManuscript) {
      checkManuscript.className = `check-item ${hasManuscript ? 'valid' : 'invalid'}`;
      checkManuscript.textContent = `Manuscript File: ${hasManuscript ? 'Attached' : 'Required'}`;
    }

    if (nextBtnStep2) {
      const canProceed = hasCover && hasManuscript;
      nextBtnStep2.disabled = !canProceed;
      if (!canProceed) {
        nextBtnStep2.setAttribute('title', 'Please attach both a Cover Letter and Manuscript File to continue.');
      } else {
        nextBtnStep2.removeAttribute('title');
      }
    }
  }

  /* ===========================================
     4. DECLARATIONS & ABSTRACT WORD COUNTER & DENSITY
     =========================================== */
  function setupDeclarationsAndForm() {
    const abstractArea = document.getElementById('input-abstract');
    if (abstractArea) {
      abstractArea.addEventListener('input', () => {
        updateAbstractWordCountAndDensity(abstractArea.value);
        saveDraftToStorage();
      });
    }

    const titleInput = document.getElementById('input-title');
    if (titleInput) {
      titleInput.addEventListener('input', () => {
        submissionState.metadata.title = titleInput.value;
        saveDraftToStorage();
      });
    }

    const keywordsInput = document.getElementById('input-keywords');
    if (keywordsInput) {
      keywordsInput.addEventListener('input', () => {
        submissionState.metadata.keywords = keywordsInput.value;
        saveDraftToStorage();
      });
    }

    const sectionSelect = document.getElementById('input-section');
    if (sectionSelect) {
      sectionSelect.addEventListener('change', () => {
        submissionState.metadata.section = sectionSelect.value;
        saveDraftToStorage();
      });
    }

    const priorRadios = document.querySelectorAll('input[name="prior-submission"]');
    const priorDetailsBox = document.getElementById('prior-details-box');
    priorRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (priorDetailsBox) {
          if (radio.value === 'yes') {
            priorDetailsBox.classList.add('is-open');
          } else {
            priorDetailsBox.classList.remove('is-open');
          }
        }
        saveFormDataToState();
        saveDraftToStorage();
      });
    });

    const priorDetails = document.getElementById('input-prior-details');
    if (priorDetails) {
      priorDetails.addEventListener('input', () => {
        submissionState.metadata.priorDetails = priorDetails.value;
        saveDraftToStorage();
      });
    }

    const coiRadios = document.querySelectorAll('input[name="coi"]');
    const coiDetailsBox = document.getElementById('coi-details-box');
    coiRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (coiDetailsBox) {
          if (radio.value === 'yes') {
            coiDetailsBox.classList.add('is-open');
          } else {
            coiDetailsBox.classList.remove('is-open');
          }
        }
        saveFormDataToState();
        saveDraftToStorage();
      });
    });

    const coiDetails = document.getElementById('input-coi-details');
    if (coiDetails) {
      coiDetails.addEventListener('input', () => {
        submissionState.metadata.coiDetails = coiDetails.value;
        saveDraftToStorage();
      });
    }

    const ethicsRadios = document.querySelectorAll('input[name="ethics"]');
    const ethicsDetailsBox = document.getElementById('ethics-details-box');
    ethicsRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (ethicsDetailsBox) {
          if (radio.value === 'yes') {
            ethicsDetailsBox.classList.add('is-open');
          } else {
            ethicsDetailsBox.classList.remove('is-open');
          }
        }
        saveFormDataToState();
        saveDraftToStorage();
      });
    });

    const ethicsDetails = document.getElementById('input-ethics-details');
    if (ethicsDetails) {
      ethicsDetails.addEventListener('input', () => {
        submissionState.metadata.ethicsDetails = ethicsDetails.value;
        saveDraftToStorage();
      });
    }

    const fundingInput = document.getElementById('input-funding');
    if (fundingInput) {
      fundingInput.addEventListener('input', () => {
        submissionState.metadata.funding = fundingInput.value;
        saveDraftToStorage();
      });
    }

    const dataAvailInput = document.getElementById('input-data-availability');
    if (dataAvailInput) {
      dataAvailInput.addEventListener('input', () => {
        submissionState.metadata.dataAvailability = dataAvailInput.value;
        saveDraftToStorage();
      });
    }
  }

  function updateAbstractWordCountAndDensity(text) {
    const wordCounter = document.getElementById('abstract-word-count');
    const abstractArea = document.getElementById('input-abstract');
    const val = typeof text === 'string' ? text : (abstractArea ? abstractArea.value : '');
    const trimmed = val.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    if (wordCounter) {
      if (wordCount > 250) {
        wordCounter.innerHTML = `<span style="color: var(--em-danger); font-weight: 700;">${wordCount} / 250 words (Exceeds maximum 250-word limit)</span>`;
        if (abstractArea) abstractArea.style.borderColor = 'var(--em-danger)';
      } else {
        wordCounter.innerHTML = `${wordCount} / 250 words`;
        if (abstractArea) abstractArea.style.borderColor = '';
      }
    }

    renderKeywordDensity(words);
  }

  function renderKeywordDensity(words) {
    const container = document.getElementById('density-chips-wrap');
    if (!container) return;

    if (!words || words.length === 0) {
      container.innerHTML = `<span class="density-placeholder">Enter or extract abstract to display keyword density.</span>`;
      return;
    }

    const totalWords = words.length;
    // Clean tokens: lowercase, strip punctuation, filter length >= 3 and not in stop words
    const cleanTokens = words
      .map(w => w.toLowerCase().replace(/[^a-z0-9\-]/g, ''))
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

    if (cleanTokens.length === 0) {
      container.innerHTML = `<span class="density-placeholder">No significant keywords identified yet.</span>`;
      return;
    }

    let items = [];

    if (currentDensityNgram === 1) {
      const freqMap = {};
      cleanTokens.forEach(t => {
        freqMap[t] = (freqMap[t] || 0) + 1;
      });
      items = Object.keys(freqMap)
        .map(term => ({ term, count: freqMap[term], pct: Math.round((freqMap[term] / totalWords) * 100) }))
        .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
        .slice(0, 10);
    } else {
      // 2-word n-gram (bigrams)
      const freqMap = {};
      for (let i = 0; i < cleanTokens.length - 1; i++) {
        const bigram = `${cleanTokens[i]} ${cleanTokens[i + 1]}`;
        freqMap[bigram] = (freqMap[bigram] || 0) + 1;
      }
      items = Object.keys(freqMap)
        .filter(b => freqMap[b] > 1)
        .map(term => ({ term, count: freqMap[term], pct: Math.round((freqMap[term] / totalWords) * 100) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      if (items.length === 0) {
        items = Object.keys(freqMap)
          .map(term => ({ term, count: freqMap[term], pct: Math.round((freqMap[term] / totalWords) * 100) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
      }
    }

    if (items.length === 0) {
      container.innerHTML = `<span class="density-placeholder">No repeating phrases found in abstract.</span>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <span class="density-chip" title="Click to add to keywords" data-term="${escapeHtml(item.term)}">
        <span class="density-freq">${item.count} (${item.pct}%)</span>
        <span>${escapeHtml(item.term)}</span>
      </span>
    `).join('');

    // Clicking a chip appends it to keywords input with semicolon delimiter
    container.querySelectorAll('.density-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const term = chip.getAttribute('data-term');
        const keywordsInput = document.getElementById('input-keywords');
        if (keywordsInput && term) {
          let current = keywordsInput.value.split(';').map(k => k.trim()).filter(Boolean);
          if (!current.some(k => k.toLowerCase() === term.toLowerCase())) {
            current.push(term);
            keywordsInput.value = current.join('; ');
            submissionState.metadata.keywords = keywordsInput.value;
            saveDraftToStorage();
          }
        }
      });
    });
  }

  function setupKeywordDensitySystem() {
    const btnX1 = document.getElementById('btn-density-x1');
    const btnX2 = document.getElementById('btn-density-x2');

    if (btnX1 && btnX2) {
      btnX1.addEventListener('click', () => {
        currentDensityNgram = 1;
        btnX1.classList.add('active');
        btnX2.classList.remove('active');
        const abstractArea = document.getElementById('input-abstract');
        updateAbstractWordCountAndDensity(abstractArea ? abstractArea.value : '');
      });

      btnX2.addEventListener('click', () => {
        currentDensityNgram = 2;
        btnX2.classList.add('active');
        btnX1.classList.remove('active');
        const abstractArea = document.getElementById('input-abstract');
        updateAbstractWordCountAndDensity(abstractArea ? abstractArea.value : '');
      });
    }
  }

  /* ===========================================
     DRAFT AUTO-SAVE & RECOVERY SYSTEM
     =========================================== */
  function saveDraftToStorage() {
    try {
      saveFormDataToState();
      saveAuthorsFromDOM();
      const draftData = {
        currentStep: submissionState.currentStep,
        articleType: submissionState.articleType,
        publishingModel: submissionState.publishingModel,
        metadata: submissionState.metadata,
        authors: submissionState.authors,
        files: submissionState.files.map(f => ({
          id: f.id,
          itemType: f.itemType,
          name: f.name,
          size: f.size,
          type: f.type,
          timestamp: f.timestamp
        })),
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    } catch (e) {
      console.warn('Could not save submission draft to localStorage:', e);
    }
  }

  function loadDraftFromStorage() {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return false;
      const draft = JSON.parse(raw);
      if (!draft) return false;

      if (draft.articleType) submissionState.articleType = draft.articleType;
      if (draft.publishingModel) submissionState.publishingModel = draft.publishingModel;
      if (draft.metadata) submissionState.metadata = Object.assign(submissionState.metadata, draft.metadata);
      if (Array.isArray(draft.authors) && draft.authors.length > 0) {
        submissionState.authors = draft.authors;
      }
      if (Array.isArray(draft.files) && draft.files.length > 0) {
        submissionState.files = draft.files;
      }

      // Populate form fields
      const titleInput = document.getElementById('input-title');
      if (titleInput && submissionState.metadata.title) {
        titleInput.value = submissionState.metadata.title;
      }
      const abstractInput = document.getElementById('input-abstract');
      if (abstractInput && submissionState.metadata.abstract) {
        abstractInput.value = submissionState.metadata.abstract;
      }
      const keywordsInput = document.getElementById('input-keywords');
      if (keywordsInput && submissionState.metadata.keywords) {
        keywordsInput.value = submissionState.metadata.keywords;
      }
      const sectionInput = document.getElementById('input-section');
      if (sectionInput && submissionState.metadata.section) {
        sectionInput.value = submissionState.metadata.section;
      }

      // Declarations
      if (submissionState.metadata.priorSubmission) {
        const rad = document.querySelector(`input[name="prior-submission"][value="${submissionState.metadata.priorSubmission}"]`);
        if (rad) rad.checked = true;
        const box = document.getElementById('prior-details-box');
        if (box) {
          if (submissionState.metadata.priorSubmission === 'yes') box.classList.add('is-open');
          else box.classList.remove('is-open');
        }
      }
      if (submissionState.metadata.priorDetails) {
        const inp = document.getElementById('input-prior-details');
        if (inp) inp.value = submissionState.metadata.priorDetails;
      }

      if (submissionState.metadata.coi) {
        const rad = document.querySelector(`input[name="coi"][value="${submissionState.metadata.coi}"]`);
        if (rad) rad.checked = true;
        const box = document.getElementById('coi-details-box');
        if (box) {
          if (submissionState.metadata.coi === 'yes') box.classList.add('is-open');
          else box.classList.remove('is-open');
        }
      }
      if (submissionState.metadata.coiDetails) {
        const inp = document.getElementById('input-coi-details');
        if (inp) inp.value = submissionState.metadata.coiDetails;
      }

      if (submissionState.metadata.ethics) {
        const rad = document.querySelector(`input[name="ethics"][value="${submissionState.metadata.ethics}"]`);
        if (rad) rad.checked = true;
        const box = document.getElementById('ethics-details-box');
        if (box) {
          if (submissionState.metadata.ethics === 'yes') box.classList.add('is-open');
          else box.classList.remove('is-open');
        }
      }
      if (submissionState.metadata.ethicsDetails) {
        const inp = document.getElementById('input-ethics-details');
        if (inp) inp.value = submissionState.metadata.ethicsDetails;
      }

      if (submissionState.metadata.funding) {
        const inp = document.getElementById('input-funding');
        if (inp) inp.value = submissionState.metadata.funding;
      }
      if (submissionState.metadata.dataAvailability) {
        const inp = document.getElementById('input-data-availability');
        if (inp) inp.value = submissionState.metadata.dataAvailability;
      }

      // Article type select
      const rows = document.querySelectorAll('.article-type-row');
      rows.forEach(r => {
        if (r.getAttribute('data-type') === submissionState.articleType) {
          r.classList.add('selected');
          const rad = r.querySelector('input[type="radio"]');
          if (rad) rad.checked = true;
        } else {
          r.classList.remove('selected');
        }
      });

      // Update files table
      renderFilesTable();

      // Show banner
      const banner = document.getElementById('draft-notice-banner');
      if (banner) banner.style.display = 'flex';

      // Update word count & density immediately
      updateAbstractWordCountAndDensity(submissionState.metadata.abstract || '');

      return true;
    } catch (e) {
      console.warn('Could not load draft from localStorage:', e);
      return false;
    }
  }

  function setupDraftControls() {
    const btnClean = document.getElementById('btn-start-over-clean');
    if (btnClean) {
      btnClean.addEventListener('click', () => {
        const ok = confirm('Are you sure you want to discard your saved draft and start fresh? All entered data will be reset.');
        if (!ok) return;
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        // Reset state
        submissionState.currentStep = 1;
        submissionState.articleType = 'original-research';
        submissionState.files = [];
        submissionState.metadata = {
          title: '',
          abstract: '',
          keywords: '',
          section: 'AMR Genomics & Resistome Profiling',
          priorSubmission: 'no',
          priorDetails: '',
          coi: 'no',
          coiDetails: '',
          funding: '',
          ethics: 'na',
          ethicsDetails: '',
          dataAvailability: ''
        };
        submissionState.authors = [
          {
            id: 'auth_1',
            prefix: 'Dr.',
            firstName: '',
            middleName: '',
            familyName: '',
            email: '',
            institution: '',
            country: '',
            orcid: '',
            isCorresponding: true
          }
        ];
        // Reset form inputs
        document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(inp => inp.value = '');
        const banner = document.getElementById('draft-notice-banner');
        if (banner) banner.style.display = 'none';
        goToStep(1);
        renderFilesTable();
        renderAuthorsList();
        updateAbstractWordCountAndDensity('');
        updateValidationIndicators();
      });
    }
  }

  function saveFormDataToState() {
    submissionState.metadata.title = document.getElementById('input-title')?.value || '';
    submissionState.metadata.abstract = document.getElementById('input-abstract')?.value || '';
    submissionState.metadata.keywords = document.getElementById('input-keywords')?.value || '';
    submissionState.metadata.section = document.getElementById('input-section')?.value || '';

    const priorVal = document.querySelector('input[name="prior-submission"]:checked')?.value || 'no';
    submissionState.metadata.priorSubmission = priorVal;
    submissionState.metadata.priorDetails = document.getElementById('input-prior-details')?.value || '';

    const coiVal = document.querySelector('input[name="coi"]:checked')?.value || 'no';
    submissionState.metadata.coi = coiVal;
    submissionState.metadata.coiDetails = document.getElementById('input-coi-details')?.value || '';

    const ethicsVal = document.querySelector('input[name="ethics"]:checked')?.value || 'na';
    submissionState.metadata.ethics = ethicsVal;
    submissionState.metadata.ethicsDetails = document.getElementById('input-ethics-details')?.value || '';

    submissionState.metadata.funding = document.getElementById('input-funding')?.value || '';
    submissionState.metadata.dataAvailability = document.getElementById('input-data-availability')?.value || '';
  }

  /* ===========================================
     5. AUTHOR MANAGEMENT, REORDERING & SEARCH
     =========================================== */
  function setupAuthorManagement() {
    const addAuthorBtn = document.getElementById('btn-add-coauthor');
    if (addAuthorBtn) {
      addAuthorBtn.addEventListener('click', () => {
        saveAuthorsFromDOM();
        const newAuthor = {
          id: 'auth_' + Math.random().toString(36).substr(2, 9),
          prefix: '',
          firstName: '',
          middleName: '',
          familyName: '',
          email: '',
          institution: '',
          country: '',
          orcid: '',
          isCorresponding: false
        };
        submissionState.authors.push(newAuthor);
        renderAuthorsList();
        saveDraftToStorage();
      });
    }

    renderAuthorsList();
  }

  function saveAuthorsFromDOM() {
    const container = document.getElementById('authors-wrapper');
    if (!container) return;
    container.querySelectorAll('.author-entry-card').forEach(card => {
      const authId = card.getAttribute('data-author-id');
      const author = submissionState.authors.find(a => a.id === authId);
      if (!author) return;
      author.prefix = card.querySelector('.auth-prefix')?.value || '';
      author.firstName = card.querySelector('[data-field="firstName"]')?.value || '';
      author.middleName = card.querySelector('[data-field="middleName"]')?.value || '';
      author.familyName = card.querySelector('[data-field="familyName"]')?.value || '';
      author.email = card.querySelector('[data-field="email"]')?.value || '';
      author.institution = card.querySelector('.auth-inst-input')?.value || '';
      author.country = card.querySelector('.auth-country')?.value || '';
      author.orcid = card.querySelector('[data-field="orcid"]')?.value || '';
      const corrRadio = card.querySelector('.corresponding-radio');
      if (corrRadio && corrRadio.checked) {
        submissionState.authors.forEach(a => a.isCorresponding = (a.id === authId));
      }
    });
  }

  function renderAuthorsList() {
    const container = document.getElementById('authors-wrapper');
    if (!container) return;

    container.innerHTML = submissionState.authors.map((author, index) => {
      const isFirst = index === 0;
      const isLast = index === submissionState.authors.length - 1;
      return `
        <div class="author-entry-card" data-author-id="${author.id}">
          <div class="author-header-strip">
            <div class="author-header-left">
              <span class="author-number">Author ${index + 1}</span>
              <div class="author-reorder-group">
                <button type="button" class="btn-author-move" data-action="up" data-index="${index}" title="Move Author Up" ${isFirst ? 'disabled' : ''}>Move Up</button>
                <button type="button" class="btn-author-move" data-action="down" data-index="${index}" title="Move Author Down" ${isLast ? 'disabled' : ''}>Move Down</button>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <label style="font-size: 0.825rem; font-weight: 700; color: var(--em-navy); display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                <input type="radio" name="corresponding-author-radio" class="corresponding-radio" data-author-id="${author.id}" ${author.isCorresponding ? 'checked' : ''}>
                Corresponding Author
              </label>
              ${submissionState.authors.length > 1 ? `<button type="button" class="btn-remove-file btn-remove-author" data-author-id="${author.id}">Remove Author</button>` : ''}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 90px 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Title</label>
              <select class="form-control auth-prefix" data-field="prefix">
                <option value="Dr." ${author.prefix === 'Dr.' ? 'selected' : ''}>Dr.</option>
                <option value="Prof." ${author.prefix === 'Prof.' ? 'selected' : ''}>Prof.</option>
                <option value="Mr." ${author.prefix === 'Mr.' ? 'selected' : ''}>Mr.</option>
                <option value="Ms." ${author.prefix === 'Ms.' ? 'selected' : ''}>Ms.</option>
                <option value="" ${!author.prefix ? 'selected' : ''}>None</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>First Name <span class="req">*</span></label>
              <input type="text" class="form-control auth-field" data-field="firstName" value="${escapeHtml(author.firstName)}" placeholder="First / Given Name">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>Middle Name</label>
              <input type="text" class="form-control auth-field" data-field="middleName" value="${escapeHtml(author.middleName)}" placeholder="Middle Name">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>Family Name <span class="req">*</span></label>
              <input type="text" class="form-control auth-field" data-field="familyName" value="${escapeHtml(author.familyName)}" placeholder="Family / Surname">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1.25fr 1fr 1fr; gap: 0.75rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Email Address <span class="req">*</span></label>
              <input type="email" class="form-control auth-field" data-field="email" value="${escapeHtml(author.email)}" placeholder="author@institution.edu">
            </div>
            <div class="form-group institution-search-wrap" style="margin-bottom: 0;">
              <label>Institution <span class="req">*</span></label>
              <input type="text" class="form-control auth-inst-input" data-field="institution" value="${escapeHtml(author.institution)}" placeholder="Type to search institution...">
              <ul class="institution-results-dropdown"></ul>
            </div>
            <div class="form-group country-search-wrap" style="margin-bottom: 0;">
              <label>Country <span class="req">*</span></label>
              <input type="text" class="form-control auth-field auth-country" data-field="country" value="${escapeHtml(author.country)}" placeholder="Type to search country...">
              <ul class="country-results-dropdown"></ul>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>ORCID iD</label>
              <input type="text" class="form-control auth-field" data-field="orcid" value="${escapeHtml(author.orcid)}" placeholder="0000-0000-0000-0000">
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('.author-entry-card').forEach(card => {
      const authId = card.getAttribute('data-author-id');
      const author = submissionState.authors.find(a => a.id === authId);
      if (!author) return;

      // Inputs binding
      card.querySelectorAll('.auth-field, .auth-prefix').forEach(input => {
        input.addEventListener('input', (e) => {
          const field = e.target.getAttribute('data-field');
          author[field] = e.target.value;
          saveDraftToStorage();
        });
      });

      // Move Up / Move Down buttons
      card.querySelectorAll('.btn-author-move').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          saveAuthorsFromDOM();
          const action = btn.getAttribute('data-action');
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (action === 'up' && idx > 0) {
            const temp = submissionState.authors[idx];
            submissionState.authors[idx] = submissionState.authors[idx - 1];
            submissionState.authors[idx - 1] = temp;
            renderAuthorsList();
            saveDraftToStorage();
          } else if (action === 'down' && idx < submissionState.authors.length - 1) {
            const temp = submissionState.authors[idx];
            submissionState.authors[idx] = submissionState.authors[idx + 1];
            submissionState.authors[idx + 1] = temp;
            renderAuthorsList();
            saveDraftToStorage();
          }
        });
      });

      // Corresponding radio
      const corrRadio = card.querySelector('.corresponding-radio');
      if (corrRadio) {
        corrRadio.addEventListener('change', () => {
          submissionState.authors.forEach(a => a.isCorresponding = (a.id === authId));
          saveDraftToStorage();
        });
      }

      // Remove author
      const removeBtn = card.querySelector('.btn-remove-author');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          saveAuthorsFromDOM();
          const idx = submissionState.authors.findIndex(a => a.id === authId);
          if (idx !== -1) {
            submissionState.authors.splice(idx, 1);
            if (!submissionState.authors.some(a => a.isCorresponding) && submissionState.authors.length > 0) {
              submissionState.authors[0].isCorresponding = true;
            }
            renderAuthorsList();
            saveDraftToStorage();
          }
        });
      }

      // Institution & Country Autocomplete
      setupInstitutionAutocomplete(card, author);
      setupCountryAutocomplete(card, author);
    });
  }

  function setupInstitutionAutocomplete(card, author) {
    const instInput = card.querySelector('.auth-inst-input');
    const countryInput = card.querySelector('.auth-country');
    const dropdown = card.querySelector('.institution-results-dropdown');

    if (!instInput || !dropdown) return;

    instInput.addEventListener('input', () => {
      const query = instInput.value.trim().toLowerCase();
      author.institution = instInput.value;
      saveDraftToStorage();

      if (query.length < 2) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
        return;
      }

      const matches = INSTITUTIONS_DB.filter(item => 
        item.name.toLowerCase().includes(query) || item.country.toLowerCase().includes(query)
      ).slice(0, 6);

      let html = matches.map(m => `
        <li class="institution-result-item" data-name="${escapeHtml(m.name)}" data-country="${escapeHtml(m.country)}">
          <span>${escapeHtml(m.name)}</span>
          <span style="color: var(--em-muted); font-size: 0.75rem;">${escapeHtml(m.country)}</span>
        </li>
      `).join('');

      html += `
        <li class="institution-add-custom-btn" data-custom="${escapeHtml(instInput.value)}">
          + Add "${escapeHtml(instInput.value)}" as custom institution
        </li>
      `;

      dropdown.innerHTML = html;
      dropdown.classList.add('is-open');

      // Click on match
      dropdown.querySelectorAll('.institution-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const chosenName = item.getAttribute('data-name');
          const chosenCountry = item.getAttribute('data-country');
          instInput.value = chosenName;
          author.institution = chosenName;
          if (countryInput && !countryInput.value.trim()) {
            countryInput.value = chosenCountry;
            author.country = chosenCountry;
          }
          dropdown.classList.remove('is-open');
          saveDraftToStorage();
        });
      });

      // Click on custom
      const customBtn = dropdown.querySelector('.institution-add-custom-btn');
      if (customBtn) {
        customBtn.addEventListener('click', () => {
          dropdown.classList.remove('is-open');
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });
  }

  function setupCountryAutocomplete(card, author) {
    const countryInput = card.querySelector('.auth-country');
    const dropdown = card.querySelector('.country-results-dropdown');
    if (!countryInput || !dropdown) return;

    countryInput.addEventListener('input', () => {
      const query = countryInput.value.trim().toLowerCase();
      author.country = countryInput.value;
      saveDraftToStorage();

      if (query.length < 1) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
        return;
      }

      const matches = COUNTRIES_DB.filter(c => c.toLowerCase().includes(query)).slice(0, 8);
      if (matches.length === 0) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = matches.map(c => `
        <li class="country-result-item" data-country="${escapeHtml(c)}">${escapeHtml(c)}</li>
      `).join('');
      dropdown.classList.add('is-open');

      dropdown.querySelectorAll('.country-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const chosen = item.getAttribute('data-country');
          countryInput.value = chosen;
          author.country = chosen;
          dropdown.classList.remove('is-open');
          saveDraftToStorage();
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });
  }

  /* ===========================================
     6. HYBRID JOURNAL MODEL SELECTION
     =========================================== */
  function setupHybridModelSelection() {
    const hybridCards = document.querySelectorAll('.hybrid-card');
    hybridCards.forEach(card => {
      card.addEventListener('click', () => {
        hybridCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        submissionState.publishingModel = card.getAttribute('data-model');
        saveDraftToStorage();
      });
    });
  }

  /* ===========================================
     7. REVIEW, DISPATCH & STORAGE FOR EDITOR PORTAL
     =========================================== */
  function setupSubmissionReview() {
    const submitBtn = document.getElementById('btn-final-submit');
    const agreementCheck = document.getElementById('confirm-agreement-check');

    if (agreementCheck && submitBtn) {
      agreementCheck.addEventListener('change', () => {
        submitBtn.disabled = !agreementCheck.checked;
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', handleFinalSubmission);
    }
  }

  function renderReviewSummary() {
    saveFormDataToState();

    const summaryBox = document.getElementById('review-summary-content');
    if (!summaryBox) return;

    const rowElement = document.querySelector(`.article-type-row[data-type="${submissionState.articleType}"] .article-type-title`);
    const articleTypeName = rowElement ? rowElement.textContent : submissionState.articleType;

    const filesListHtml = submissionState.files.map(f => {
      const def = ITEM_DEFINITIONS[f.itemType] || { name: f.itemType };
      return `<li><span><strong>${def.name}:</strong> ${escapeHtml(f.name)}</span> <span style="color: var(--em-muted);">${formatBytes(f.size)}</span></li>`;
    }).join('');

    const authorsListHtml = submissionState.authors.map(a => {
      const fullName = [a.prefix, a.firstName, a.middleName, a.familyName].filter(Boolean).join(' ');
      return `<li>${escapeHtml(fullName)} (${escapeHtml(a.institution || 'Affiliation pending')}) - <em>${escapeHtml(a.email)}</em> ${a.isCorresponding ? '<strong>[Corresponding Author]</strong>' : ''}</li>`;
    }).join('');

    summaryBox.innerHTML = `
      <div class="review-item-row">
        <div class="review-label">Article Category:</div>
        <div class="review-value"><strong>${escapeHtml(articleTypeName)}</strong></div>
      </div>
      <div class="review-item-row">
        <div class="review-label">Manuscript Title:</div>
        <div class="review-value">${escapeHtml(submissionState.metadata.title) || '<em>(Untitled)</em>'}</div>
      </div>
      <div class="review-item-row">
        <div class="review-label">Authors (${submissionState.authors.length}):</div>
        <div class="review-value">
          <ul class="review-files-list">${authorsListHtml}</ul>
        </div>
      </div>
      <div class="review-item-row">
        <div class="review-label">Attached Files (${submissionState.files.length}):</div>
        <div class="review-value">
          <ul class="review-files-list">${filesListHtml}</ul>
        </div>
      </div>
      <div class="review-item-row">
        <div class="review-label">Publishing Choice:</div>
        <div class="review-value">
          ${submissionState.publishingModel === 'open-access' 
            ? '<span class="item-badge badge-cover">Gold Open Access (CC BY 4.0)</span>' 
            : '<span class="item-badge badge-supplementary">Subscription Publishing (Zero APC)</span>'}
        </div>
      </div>
      <div class="review-item-row">
        <div class="review-label">Prior Publication:</div>
        <div class="review-value">${submissionState.metadata.priorSubmission === 'no' ? 'None (Original submission)' : 'Disclosed: ' + escapeHtml(submissionState.metadata.priorDetails)}</div>
      </div>
      <div class="review-item-row">
        <div class="review-label">Competing Interests:</div>
        <div class="review-value">${submissionState.metadata.coi === 'no' ? 'No competing interests declared' : 'Disclosed: ' + escapeHtml(submissionState.metadata.coiDetails)}</div>
      </div>
    `;
  }

  async function handleFinalSubmission() {
    const submitBtn = document.getElementById('btn-final-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating Package...';
    }

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `JMR-2026-${randomSeq}`;
    submissionState.submissionId = trackingId;

    const corrAuthor = submissionState.authors.find(a => a.isCorresponding) || submissionState.authors[0];
    const corrFullName = [corrAuthor.prefix, corrAuthor.firstName, corrAuthor.middleName, corrAuthor.familyName].filter(Boolean).join(' ');

    const manifest = {
      journal: 'Journal of MetaResistome',
      issnOnline: 'Pending (Inaugural Vol 1)',
      trackingId: trackingId,
      submissionTimestamp: new Date().toISOString(),
      articleType: submissionState.articleType,
      publishingModel: submissionState.publishingModel,
      metadata: submissionState.metadata,
      authors: submissionState.authors,
      correspondingAuthor: {
        name: corrFullName,
        email: corrAuthor.email,
        institution: corrAuthor.institution
      },
      filesManifest: submissionState.files.map(f => ({
        itemType: f.itemType,
        name: f.name,
        size: f.size,
        type: f.type
      }))
    };

    // Save to persistent localStorage for Editor Portal (editor-portal.html)
    saveSubmissionToEditorDatabase(manifest);

    // Try building a client-side ZIP bundle using JSZip if available
    try {
      if (typeof JSZip !== 'undefined') {
        const zip = new JSZip();
        zip.file(`SUBMISSION_MANIFEST_${trackingId}.json`, JSON.stringify(manifest, null, 2));

        const summaryText = buildSummaryText(manifest);
        zip.file(`SUBMISSION_RECEIPT_${trackingId}.txt`, summaryText);

        submissionState.files.forEach(f => {
          zip.file(`files/${f.itemType}_${f.name}`, f.file);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        triggerDownload(content, `JMR_Submission_Package_${trackingId}.zip`);
      } else {
        const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        triggerDownload(blob, `JMR_Manifest_${trackingId}.json`);
      }
    } catch (err) {
      console.warn('Zip creation note:', err);
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      triggerDownload(blob, `JMR_Manifest_${trackingId}.json`);
    }

    showConfirmationScreen(trackingId, manifest, corrFullName);
  }

  function saveSubmissionToEditorDatabase(manifest) {
    try {
      const key = 'jmr_editor_submissions';
      const existingJson = localStorage.getItem(key);
      const list = existingJson ? JSON.parse(existingJson) : [];
      list.unshift(manifest);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
  }

  function showConfirmationScreen(trackingId, manifest, corrFullName) {
    document.querySelectorAll('.submission-step-card').forEach(card => card.classList.remove('active'));
    document.querySelector('.submission-progress-bar').style.display = 'none';

    const successCard = document.getElementById('submission-success-card');
    const trackingDisplay = document.getElementById('tracking-id-display');
    const editorEmailLink = document.getElementById('btn-email-dispatch');

    if (trackingDisplay) trackingDisplay.textContent = trackingId;

    if (editorEmailLink) {
      const corr = submissionState.authors.find(a => a.isCorresponding) || submissionState.authors[0];
      const subject = encodeURIComponent(`[New Submission] ${trackingId}: ${submissionState.metadata.title.substring(0, 60)}...`);
      const body = encodeURIComponent(
        `Dear Editor-in-Chief,\n\n` +
        `A new manuscript has been submitted through the JMR Editorial Submission Portal:\n\n` +
        `Tracking ID: ${trackingId}\n` +
        `Title: ${submissionState.metadata.title}\n` +
        `Corresponding Author: ${corrFullName} (${corr.email})\n` +
        `Article Type: ${submissionState.articleType}\n` +
        `Publishing Model: ${submissionState.publishingModel}\n` +
        `Attached Files (${submissionState.files.length}):\n` +
        submissionState.files.map(f => ` - [${f.itemType}] ${f.name} (${formatBytes(f.size)})`).join('\n') +
        `\n\nAbstract:\n${submissionState.metadata.abstract}\n\n` +
        `The author has downloaded their submission archive (JMR_Submission_Package_${trackingId}.zip) and is transmitting this confirmation to the editorial office.`
      );
      editorEmailLink.href = `mailto:editor@metaresistome.org?subject=${subject}&body=${body}`;
    }

    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      const draftBanner = document.getElementById('draft-notice-banner');
      if (draftBanner) draftBanner.style.display = 'none';
    } catch (e) {}

    if (successCard) successCard.classList.add('active');
    window.scrollTo({ top: 80, behavior: 'smooth' });
  }

  /* ===========================================
     UTILITIES
     =========================================== */
  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildSummaryText(manifest) {
    return `===============================================================
JOURNAL OF METARESISTOME (JMR)
OFFICIAL MANUSCRIPT SUBMISSION RECEIPT
===============================================================
Tracking ID: ${manifest.trackingId}
Date Submitted: ${manifest.submissionTimestamp}
Journal: Journal of MetaResistome (ISSN Pending)
Article Type: ${manifest.articleType}
Publishing Option: ${manifest.publishingModel}

TITLE:
${manifest.metadata.title}

CORRESPONDING AUTHOR:
Name: ${manifest.correspondingAuthor.name}
Email: ${manifest.correspondingAuthor.email}
Affiliation: ${manifest.correspondingAuthor.institution}

ALL AUTHORS:
${manifest.authors.map(a => `- ${[a.prefix, a.firstName, a.middleName, a.familyName].filter(Boolean).join(' ')} (${a.institution}) [${a.isCorresponding ? 'Corresponding' : 'Co-Author'}]`).join('\n')}

ABSTRACT:
${manifest.metadata.abstract}

ATTACHED FILES:
${manifest.filesManifest.map(f => `- [${f.itemType}] ${f.name} (${f.size} bytes)`).join('\n')}

DECLARATIONS:
- Prior Publication: ${manifest.metadata.priorSubmission}
- Competing Interests: ${manifest.metadata.coi}
- Ethical Approval: ${manifest.metadata.ethics}
- Data Availability: ${manifest.metadata.dataAvailability || 'Deposition indicated'}
===============================================================`;
  }

})();
