/**
 * Journal of MetaResistome (JMR) - Runtime Engine
 * 
 * Implements:
 * 1. Strict feature-flag and metric hiding (zero layout shift).
 * 2. Dual-pattern navigation: accessible modal previews with "Open full page" links.
 * 3. Keyboard accessibility (ESC closes modal, focus management).
 */

document.addEventListener('DOMContentLoaded', () => {
  initFeatureFlags();
  initModalSystem();
  initSearch();
  initNavDropdowns();
});

/**
 * 1. FEATURE FLAGS & METRIC CONTROLS
 * Rules from instruction:
 * - A metric/badge/button renders ONLY if non-null and non-empty.
 * - When null, the slot is NOT rendered at all  -  no empty box, no placeholder.
 */
function initFeatureFlags() {
  if (typeof JOURNAL_SETTINGS === 'undefined') return;

  // Masthead ISSN / eISSN
  const issnContainer = document.getElementById('masthead-issn-slot');
  if (issnContainer) {
    const parts = [];
    if (JOURNAL_SETTINGS.issn) parts.push(`ISSN: ${JOURNAL_SETTINGS.issn}`);
    if (JOURNAL_SETTINGS.eissn) parts.push(`eISSN: ${JOURNAL_SETTINGS.eissn}`);
    
    if (parts.length > 0) {
      issnContainer.textContent = parts.join(' | ');
      issnContainer.style.display = 'block';
    } else {
      issnContainer.style.display = 'none';
    }
  }

  // Metrics strip (Impact Factor, CiteScore)
  const metricsSlot = document.getElementById('masthead-metrics-slot');
  if (metricsSlot) {
    const items = [];
    if (JOURNAL_SETTINGS.impactFactor) {
      items.push(`<span class="metric-item"><strong>Impact Factor:</strong> ${JOURNAL_SETTINGS.impactFactor}</span>`);
    }
    if (JOURNAL_SETTINGS.citeScore) {
      items.push(`<span class="metric-item"><strong>CiteScore:</strong> ${JOURNAL_SETTINGS.citeScore}</span>`);
    }
    if (JOURNAL_SETTINGS.acceptanceRate) {
      items.push(`<span class="metric-item"><strong>Acceptance Rate:</strong> ${JOURNAL_SETTINGS.acceptanceRate}</span>`);
    }

    if (items.length > 0) {
      metricsSlot.innerHTML = items.join('');
      metricsSlot.classList.add('has-metrics');
    } else {
      metricsSlot.style.display = 'none';
    }
  }

  // Submit manuscript CTA (Hidden until submission system is live)
  const submitNavBtn = document.getElementById('nav-submit-cta');
  if (submitNavBtn) {
    if (JOURNAL_SETTINGS.submissionLive) {
      submitNavBtn.classList.add('is-live');
    } else {
      submitNavBtn.style.display = 'none';
    }
  }
}

/**
 * 2. DUAL-PATTERN MODAL PREVIEW SYSTEM
 * Renders modal content from JOURNAL_CONTENT (same source as full pages)
 * Includes an "Open full page" link leading to the dedicated page.
 */
function initModalSystem() {
  const backdrop = document.getElementById('journal-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalFullPageLink = document.getElementById('modal-full-page-link');
  const closeBtn = document.getElementById('journal-modal-close');

  if (!backdrop) return;

  // Open modal triggers
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetKey = trigger.getAttribute('data-modal-target');
      
      if (typeof JOURNAL_CONTENT !== 'undefined' && JOURNAL_CONTENT[targetKey]) {
        const item = JOURNAL_CONTENT[targetKey];
        modalTitle.textContent = item.title;
        modalBody.innerHTML = item.fullText;
        modalFullPageLink.href = `${item.slug}.html`;
        modalFullPageLink.textContent = `Open full page for ${item.title} ↗`;
        
        openModal();
      }
    });
  });

  function openModal() {
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Backdrop click to close
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/**
 * 3. UTILITY SEARCH
 */
function initSearch() {
  const searchForm = document.getElementById('utility-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('utility-search-input').value.trim();
      if (query) {
        window.location.href = `articles.html?q=${encodeURIComponent(query)}`;
      }
    });
  }
}

/**
 * 4. ACCESSIBLE DROPDOWN NAVIGATION (Mobile & Click Support)
 */
function initNavDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const caret = dropdown.querySelector('.dropdown-caret');
    if (caret) {
      caret.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('is-open');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    }
  });
}

