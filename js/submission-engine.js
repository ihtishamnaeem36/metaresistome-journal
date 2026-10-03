/**
 * Journal of MetaResistome (JMR) - Editorial Submission System Runtime
 * Inspired by Elsevier Editorial Manager / Aries Systems workflow
 */

(function () {
  'use strict';

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
        isCorresponding: true,
        name: '',
        email: '',
        institution: '',
        country: '',
        orcid: ''
      }
    ],
    suggestedReviewers: [
      { name: '', email: '', institution: '' },
      { name: '', email: '', institution: '' }
    ],
    publishingModel: 'open-access',
    submissionId: null
  };

  // Item Type Metadata (Single vs Multiple upload rules)
  const ITEM_DEFINITIONS = {
    cover_letter: {
      name: 'Cover Letter',
      badgeClass: 'badge-cover',
      isSingle: true,
      required: true,
      description: 'Confidential letter to Editor-in-Chief highlighting originality, significance, and ethical compliance.'
    },
    manuscript: {
      name: 'Manuscript File',
      badgeClass: 'badge-manuscript',
      isSingle: true,
      required: true,
      description: 'Complete text document (.docx or .pdf) including Introduction, Methods, Results, Discussion, and References.'
    },
    title_page: {
      name: 'Title Page (Double-Blind)',
      badgeClass: 'badge-titlepage',
      isSingle: true,
      required: false,
      description: 'Separate title page containing author details, affiliations, and acknowledgments if selecting blinded review.'
    },
    figure: {
      name: 'Figure',
      badgeClass: 'badge-figure',
      isSingle: false,
      required: false,
      description: 'High-resolution image (.png, .jpg, .tif, .eps). Multiple figures permitted.'
    },
    table: {
      name: 'Table',
      badgeClass: 'badge-table',
      isSingle: false,
      required: false,
      description: 'Data tables (.docx, .xlsx). Multiple tables permitted.'
    },
    supplementary: {
      name: 'Supplementary Material',
      badgeClass: 'badge-supplementary',
      isSingle: false,
      required: false,
      description: 'Supplementary datasets, primers, trees, or scripts (.pdf, .zip, .xlsx, .fasta).'
    },
    graphical_abstract: {
      name: 'Graphical Abstract',
      badgeClass: 'badge-graphical',
      isSingle: true,
      required: false,
      description: 'Visual summary diagram illustrating primary findings.'
    }
  };

  // DOM Elements
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

  /* ═══════════════════════════════════════════
     1. STEP NAVIGATION & PROGRESSION
     ═══════════════════════════════════════════ */
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

    // Toggle card visibility
    document.querySelectorAll('.submission-step-card').forEach(card => {
      card.classList.remove('active');
    });
    const activeCard = document.getElementById(`step-card-${stepNumber}`);
    if (activeCard) {
      activeCard.classList.add('active');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    // Update Progress Bar
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

    // If step 4 (Review), build review summary
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
      const corr = submissionState.authors[0];
      if (!corr.name.trim() || !corr.email.trim() || !corr.institution.trim()) {
        if (showAlert) alert('Please complete the corresponding author name, email, and institution.');
        return false;
      }
      return true;
    }

    return true;
  }

  /* ═══════════════════════════════════════════
     2. ARTICLE TYPE SELECTION
     ═══════════════════════════════════════════ */
  function setupArticleTypeSelection() {
    const cards = document.querySelectorAll('.article-type-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        submissionState.articleType = card.getAttribute('data-type');
        updateValidationIndicators();
      });
    });
  }

  /* ═══════════════════════════════════════════
     3. COMPLEX FILE UPLOAD SYSTEM (Single vs Multi, Red Alert, Remove)
     ═══════════════════════════════════════════ */
  function setupFileUploadSystem() {
    const itemSelect = document.getElementById('item-type-select');
    const helperText = document.getElementById('item-helper-text');
    const singleAlert = document.getElementById('single-file-alert');
    const alertMessage = document.getElementById('single-file-alert-msg');
    const dropzone = document.getElementById('dropzone-area');
    const fileInput = document.getElementById('file-upload-input');

    if (!itemSelect || !dropzone || !fileInput) return;

    // Item type change: update description & check if single-file already uploaded
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
          alertMessage.innerHTML = `⚠️ <strong>Duplicate Item Alert:</strong> You have already uploaded a <u>${def.name}</u> (<em>${escapeHtml(existing.name)}</em>). This category accepts only ONE file. To upload a different version, click the <strong>❌ Remove</strong> button next to the file in the table below before attaching a new file.`;
          singleAlert.classList.add('is-visible');
          return true;
        }
      }
      singleAlert.classList.remove('is-visible');
      return false;
    }

    // Dropzone drag/drop handlers
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
        fileInput.value = ''; // Reset so the same file can be re-selected if removed
      }
    });

    function handleIncomingFiles(fileList) {
      const selectedType = itemSelect.value;
      const def = ITEM_DEFINITIONS[selectedType];
      if (!def) return;

      // Single-file check
      if (def.isSingle) {
        const existing = submissionState.files.find(f => f.itemType === selectedType);
        if (existing) {
          alertMessage.innerHTML = `⚠️ <strong>Action Blocked:</strong> You have already uploaded a <u>${def.name}</u> (<em>${escapeHtml(existing.name)}</em>). To replace it, please first remove the existing file using the <strong>❌ Remove</strong> button in the table below.`;
          singleAlert.classList.add('is-visible');
          return;
        }
      }

      // Add files
      Array.from(fileList).forEach(file => {
        // Enforce max 1 file for single categories
        if (def.isSingle && submissionState.files.some(f => f.itemType === selectedType)) {
          return;
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
      });

      singleAlert.classList.remove('is-visible');
      renderFilesTable();
      updateValidationIndicators();
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

    tableBody.innerHTML = submissionState.files.map((fileObj, index) => {
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
            <button type="button" class="btn-remove-file" data-file-id="${fileObj.id}" title="Remove this file to re-upload">
              <span>&times;</span> Remove
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach remove event listeners
    tableBody.querySelectorAll('.btn-remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
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
      
      // Hide red alert if it was about this file
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
      checkCover.innerHTML = `${hasCover ? '✓' : '✗'} Cover Letter ${hasCover ? '(Attached)' : '(Required)'}`;
    }

    if (checkManuscript) {
      checkManuscript.className = `check-item ${hasManuscript ? 'valid' : 'invalid'}`;
      checkManuscript.innerHTML = `${hasManuscript ? '✓' : '✗'} Manuscript File ${hasManuscript ? '(Attached)' : '(Required)'}`;
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

  /* ═══════════════════════════════════════════
     4. QUESTIONNAIRE, DECLARATIONS & ABSTRACT COUNTER
     ═══════════════════════════════════════════ */
  function setupDeclarationsAndForm() {
    // Abstract word counter
    const abstractArea = document.getElementById('input-abstract');
    const wordCounter = document.getElementById('abstract-word-count');

    if (abstractArea && wordCounter) {
      abstractArea.addEventListener('input', () => {
        const text = abstractArea.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCounter.textContent = `${words} words (recommended 250 max)`;
        if (words > 300) {
          wordCounter.style.color = 'var(--em-danger)';
        } else {
          wordCounter.style.color = 'var(--em-muted)';
        }
      });
    }

    // Prior submission conditional box
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

    // Conflict of interest conditional box
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

    // Ethics conditional box
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

  function saveFormDataToState() {
    submissionState.metadata.title = document.getElementById('input-title')?.value || '';
    submissionState.metadata.abstract = document.getElementById('input-abstract')?.value || '';
    submissionState.metadata.keywords = document.getElementById('input-keywords')?.value || '';
    submissionState.metadata.section = document.getElementById('input-section')?.value || '';

    // Radios
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

    // Corresponding Author
    submissionState.authors[0].name = document.getElementById('corr-name')?.value || '';
    submissionState.authors[0].email = document.getElementById('corr-email')?.value || '';
    submissionState.authors[0].institution = document.getElementById('corr-institution')?.value || '';
    submissionState.authors[0].country = document.getElementById('corr-country')?.value || '';
    submissionState.authors[0].orcid = document.getElementById('corr-orcid')?.value || '';

    // Co-Authors
    const coAuthorCards = document.querySelectorAll('.co-author-row');
    const parsedCoAuthors = [];
    coAuthorCards.forEach(card => {
      const name = card.querySelector('.co-author-name')?.value || '';
      const email = card.querySelector('.co-author-email')?.value || '';
      const inst = card.querySelector('.co-author-institution')?.value || '';
      if (name.trim()) {
        parsedCoAuthors.push({ isCorresponding: false, name, email, institution: inst });
      }
    });

    submissionState.authors = [submissionState.authors[0], ...parsedCoAuthors];
  }

  /* ═══════════════════════════════════════════
     5. DYNAMIC AUTHOR MANAGEMENT
     ═══════════════════════════════════════════ */
  function setupAuthorManagement() {
    const addAuthorBtn = document.getElementById('btn-add-coauthor');
    const coauthorsContainer = document.getElementById('coauthors-container');

    if (!addAuthorBtn || !coauthorsContainer) return;

    addAuthorBtn.addEventListener('click', () => {
      const coAuthorIndex = coauthorsContainer.children.length + 2;
      const card = document.createElement('div');
      card.className = 'author-entry-card co-author-row';
      card.innerHTML = `
        <div class="author-header-strip">
          <span class="author-number">Co-Author ${coAuthorIndex}</span>
          <button type="button" class="btn-remove-file btn-remove-coauthor">&times; Remove Co-Author</button>
        </div>
        <div class="author-grid-3">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Full Name</label>
            <input type="text" class="form-control co-author-name" placeholder="Dr. Jane Smith">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Email Address</label>
            <input type="email" class="form-control co-author-email" placeholder="jane.smith@univ.edu">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Institution / Affiliation</label>
            <input type="text" class="form-control co-author-institution" placeholder="University, Department, City">
          </div>
        </div>
      `;

      card.querySelector('.btn-remove-coauthor').addEventListener('click', () => {
        card.remove();
        reindexCoAuthors();
      });

      coauthorsContainer.appendChild(card);
    });

    function reindexCoAuthors() {
      const rows = coauthorsContainer.querySelectorAll('.co-author-row');
      rows.forEach((row, i) => {
        const title = row.querySelector('.author-number');
        if (title) title.textContent = `Co-Author ${i + 2}`;
      });
    }
  }

  /* ═══════════════════════════════════════════
     6. HYBRID JOURNAL MODEL SELECTION
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     7. REVIEW, MANIFEST GENERATION & DISPATCH
     ═══════════════════════════════════════════ */
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

    const articleTypeCard = document.querySelector(`.article-type-card[data-type="${submissionState.articleType}"] h3`);
    const articleTypeName = articleTypeCard ? articleTypeCard.textContent : submissionState.articleType;

    const filesListHtml = submissionState.files.map(f => {
      const def = ITEM_DEFINITIONS[f.itemType] || { name: f.itemType };
      return `<li><span><strong>${def.name}:</strong> ${escapeHtml(f.name)}</span> <span style="color: var(--em-muted);">${formatBytes(f.size)}</span></li>`;
    }).join('');

    const authorsListHtml = submissionState.authors.map(a => {
      return `<li>${escapeHtml(a.name)} (${escapeHtml(a.institution || 'Affiliation pending')}) - <em>${escapeHtml(a.email)}</em> ${a.isCorresponding ? '<strong>[Corresponding]</strong>' : ''}</li>`;
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
        <div class="review-label">Prior Submission:</div>
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
      submitBtn.textContent = 'Generating Package & Dispatching...';
    }

    // Generate Tracking ID
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `JMR-2026-${randomSeq}`;
    submissionState.submissionId = trackingId;

    // Create manifest object
    const manifest = {
      journal: 'Journal of MetaResistome',
      issnOnline: 'Pending (Inaugural Vol 1)',
      trackingId: trackingId,
      submissionTimestamp: new Date().toISOString(),
      articleType: submissionState.articleType,
      publishingModel: submissionState.publishingModel,
      metadata: submissionState.metadata,
      authors: submissionState.authors,
      filesManifest: submissionState.files.map(f => ({
        itemType: f.itemType,
        name: f.name,
        size: f.size,
        type: f.type
      }))
    };

    // Try building a client-side ZIP bundle using JSZip if available
    try {
      if (typeof JSZip !== 'undefined') {
        const zip = new JSZip();
        
        // Add manifest JSON
        zip.file(`SUBMISSION_MANIFEST_${trackingId}.json`, JSON.stringify(manifest, null, 2));

        // Add human-readable summary
        const summaryText = buildSummaryText(manifest);
        zip.file(`SUBMISSION_RECEIPT_${trackingId}.txt`, summaryText);

        // Add uploaded file blobs
        submissionState.files.forEach(f => {
          zip.file(`files/${f.itemType}_${f.name}`, f.file);
        });

        // Generate zip blob & trigger download
        const content = await zip.generateAsync({ type: 'blob' });
        triggerDownload(content, `JMR_Submission_Package_${trackingId}.zip`);
      } else {
        // Fallback: download manifest JSON
        const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        triggerDownload(blob, `JMR_Manifest_${trackingId}.json`);
      }
    } catch (err) {
      console.warn('Zip creation note:', err);
      // Fallback
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      triggerDownload(blob, `JMR_Manifest_${trackingId}.json`);
    }

    // Show Confirmation Screen
    showConfirmationScreen(trackingId, manifest);
  }

  function showConfirmationScreen(trackingId, manifest) {
    // Hide all step cards
    document.querySelectorAll('.submission-step-card').forEach(card => card.classList.remove('active'));
    document.querySelector('.submission-progress-bar').style.display = 'none';

    const successCard = document.getElementById('submission-success-card');
    const trackingDisplay = document.getElementById('tracking-id-display');
    const editorEmailLink = document.getElementById('btn-email-dispatch');

    if (trackingDisplay) trackingDisplay.textContent = trackingId;

    if (editorEmailLink) {
      const corr = submissionState.authors[0];
      const subject = encodeURIComponent(`[New Submission] ${trackingId}: ${submissionState.metadata.title.substring(0, 60)}...`);
      const body = encodeURIComponent(
        `Dear Editor-in-Chief,\n\n` +
        `A new manuscript has been submitted through the JMR Editorial Submission Portal:\n\n` +
        `Tracking ID: ${trackingId}\n` +
        `Title: ${submissionState.metadata.title}\n` +
        `Corresponding Author: ${corr.name} (${corr.email})\n` +
        `Article Type: ${submissionState.articleType}\n` +
        `Publishing Model: ${submissionState.publishingModel}\n` +
        `Attached Files (${submissionState.files.length}):\n` +
        submissionState.files.map(f => ` - [${f.itemType}] ${f.name} (${formatBytes(f.size)})`).join('\n') +
        `\n\nAbstract:\n${submissionState.metadata.abstract}\n\n` +
        `The author has downloaded their official submission archive (JMR_Submission_Package_${trackingId}.zip) and is transmitting this confirmation to the editorial office.`
      );
      editorEmailLink.href = `mailto:editor@metaresistome.org?subject=${subject}&body=${body}`;
    }

    if (successCard) successCard.classList.add('active');
    window.scrollTo({ top: 80, behavior: 'smooth' });
  }

  /* ═══════════════════════════════════════════
     UTILITIES
     ═══════════════════════════════════════════ */
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
Name: ${manifest.authors[0].name}
Email: ${manifest.authors[0].email}
Affiliation: ${manifest.authors[0].institution}

CO-AUTHORS (${manifest.authors.length - 1}):
${manifest.authors.slice(1).map(a => `- ${a.name} (${a.institution})`).join('\n') || 'None'}

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
