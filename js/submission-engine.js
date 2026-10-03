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
        firstName: 'Ihtisham',
        middleName: '',
        familyName: 'Naeem',
        email: 'ihtishamnaeem36@gmail.com',
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
    setupAuthorManagement();
    setupHybridModelSelection();
    setupSubmissionReview();
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
        if (showAlert) alert('Please enter 3 to 6 keywords.');
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

        // If manuscript file, attempt automatic title & abstract extraction
        if (selectedType === 'manuscript') {
          extractTitleAndAbstractFromManuscript(file);
        }
      }

      singleAlert.classList.remove('is-visible');
      renderFilesTable();
      updateValidationIndicators();
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
  }

  // Extract Title and Abstract from .docx or .txt manuscript
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
          // Collect text following this header
          const abstractParas = [];
          let startText = line.replace(/^(abstract|summary):?/i, '').trim();
          if (startText) abstractParas.push(startText);

          for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
            const nextLine = lines[j];
            if (/^(keywords|key words|1\.\s*introduction|introduction):?/i.test(nextLine)) {
              break;
            }
            abstractParas.push(nextLine);
          }
          candidateAbstract = abstractParas.join(' ');
          break;
        }
      }

      // Pre-fill inputs if found and user hasn't typed their own yet
      let populated = false;
      const titleInput = document.getElementById('input-title');
      const abstractInput = document.getElementById('input-abstract');
      const statusBanner = document.getElementById('extraction-status-banner');

      if (candidateTitle && titleInput && !titleInput.value.trim()) {
        titleInput.value = candidateTitle;
        submissionState.metadata.title = candidateTitle;
        populated = true;
      }

      if (candidateAbstract && abstractInput && !abstractInput.value.trim()) {
        abstractInput.value = candidateAbstract;
        submissionState.metadata.abstract = candidateAbstract;
        updateWordCount(candidateAbstract);
        populated = true;
      }

      if (populated && statusBanner) {
        statusBanner.style.display = 'block';
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
     4. DECLARATIONS & ABSTRACT WORD COUNTER
     =========================================== */
  function setupDeclarationsAndForm() {
    const abstractArea = document.getElementById('input-abstract');
    if (abstractArea) {
      abstractArea.addEventListener('input', () => {
        updateWordCount(abstractArea.value);
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
      });
    });

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
      });
    });

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
      });
    });
  }

  function updateWordCount(text) {
    const wordCounter = document.getElementById('abstract-word-count');
    const abstractArea = document.getElementById('input-abstract');
    if (!wordCounter) return;

    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;

    if (words > 250) {
      wordCounter.innerHTML = `<span style="color: var(--em-danger); font-weight: 700;">${words} / 250 words (Exceeds maximum limit)</span>`;
      if (abstractArea) abstractArea.style.borderColor = 'var(--em-danger)';
    } else {
      wordCounter.innerHTML = `${words} / 250 words`;
      if (abstractArea) abstractArea.style.borderColor = '';
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
     5. AUTHOR MANAGEMENT & INSTITUTION SEARCH
     =========================================== */
  function setupAuthorManagement() {
    const addAuthorBtn = document.getElementById('btn-add-coauthor');
    if (addAuthorBtn) {
      addAuthorBtn.addEventListener('click', () => {
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
      });
    }

    renderAuthorsList();
  }

  function renderAuthorsList() {
    const container = document.getElementById('authors-wrapper');
    if (!container) return;

    container.innerHTML = submissionState.authors.map((author, index) => {
      const isFirst = index === 0;
      return `
        <div class="author-entry-card" data-author-id="${author.id}">
          <div class="author-header-strip">
            <span class="author-number">Author ${index + 1}</span>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <label style="font-size: 0.825rem; font-weight: 700; color: var(--em-navy); display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                <input type="radio" name="corresponding-author-radio" class="corresponding-radio" data-author-id="${author.id}" ${author.isCorresponding ? 'checked' : ''}>
                Corresponding Author
              </label>
              ${!isFirst ? `<button type="button" class="btn-remove-file btn-remove-author" data-author-id="${author.id}">Remove Author</button>` : ''}
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
            <div class="form-group" style="margin-bottom: 0;">
              <label>Country <span class="req">*</span></label>
              <input type="text" class="form-control auth-field auth-country" data-field="country" value="${escapeHtml(author.country)}" placeholder="e.g. United Kingdom, United States, Germany">
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
        });
      });

      // Corresponding radio
      const corrRadio = card.querySelector('.corresponding-radio');
      if (corrRadio) {
        corrRadio.addEventListener('change', () => {
          submissionState.authors.forEach(a => a.isCorresponding = (a.id === authId));
        });
      }

      // Remove author
      const removeBtn = card.querySelector('.btn-remove-author');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          const idx = submissionState.authors.findIndex(a => a.id === authId);
          if (idx !== -1) {
            submissionState.authors.splice(idx, 1);
            if (!submissionState.authors.some(a => a.isCorresponding) && submissionState.authors.length > 0) {
              submissionState.authors[0].isCorresponding = true;
            }
            renderAuthorsList();
          }
        });
      }

      // Institution Autocomplete
      setupInstitutionAutocomplete(card, author);
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
