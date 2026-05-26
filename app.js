/* ==========================================================================
   PDF X - Privacy Policy & Terms Landing Page Script
   Interactions: Tab Toggling, Clipboard Copies, Theme Switcher
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initTheme();
  initDeepLinking();
});

/* --------------------------------------------------------------------------
   1. Tab Navigation & Switching Logic
   -------------------------------------------------------------------------- */
function initTabs() {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');
      
      setActiveTab(targetTabId);
      
      // Update browser URL hash quietly without breaking scroll positioning
      history.pushState(null, null, `#${targetTabId}`);
    });
  });
}

/**
 * Programmatically switches the active tab panel
 * @param {string} tabId - The ID of the tab to activate (e.g. 'privacy-policy')
 */
function setActiveTab(tabId) {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const targetButton = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
  const targetContent = document.getElementById(tabId);

  // If tab doesn't exist, fallback silently
  if (!targetButton || !targetContent) return;

  // Deactivate all tabs
  tabLinks.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  // Activate chosen tab
  targetButton.classList.add('active');
  targetButton.setAttribute('aria-selected', 'true');
  
  targetContent.classList.add('active');
}

/* --------------------------------------------------------------------------
   2. URL Hash Deep-Linking
   -------------------------------------------------------------------------- */
function initDeepLinking() {
  // Check if standard hash exists in URL
  const hash = window.location.hash.substring(1);
  if (hash) {
    const validTabs = ['privacy-policy', 'terms-conditions', 'developer-faq'];
    if (validTabs.includes(hash)) {
      setActiveTab(hash);
      
      // Smooth scroll to the content area
      setTimeout(() => {
        const docSection = document.querySelector('.document-section');
        if (docSection) {
          docSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }

  // Handle browser navigation (back/forward keys)
  window.addEventListener('hashchange', () => {
    const freshHash = window.location.hash.substring(1);
    if (freshHash) {
      setActiveTab(freshHash);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Copy to Clipboard Utility
   -------------------------------------------------------------------------- */
async function copyText(elementId, buttonElement) {
  const codeElement = document.getElementById(elementId);
  if (!codeElement) return;

  const rawText = codeElement.textContent.trim();

  try {
    // Modern asynchronous clipboard API
    await navigator.clipboard.writeText(rawText);
    showCopyFeedback(buttonElement);
  } catch (err) {
    // Fallback approach for older browsers or non-HTTPS domains
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = rawText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    
    try {
      document.execCommand('copy');
      showCopyFeedback(buttonElement);
    } catch (fallbackErr) {
      console.error('Failed to copy to clipboard: ', fallbackErr);
    }
    
    document.body.removeChild(tempTextArea);
  }
}

/**
 * Animates the copy button to provide feedback
 * @param {HTMLElement} btn - The clicked button node
 */
function showCopyFeedback(btn) {
  const icon = btn.querySelector('i');
  const label = btn.querySelector('span');
  
  // Cache original states
  const originalText = label.textContent;
  const originalIconClass = icon.className;

  // Set copied states
  btn.classList.add('copied');
  label.textContent = 'Copied!';
  icon.className = 'fa-solid fa-check';

  // Restore original state after interval
  setTimeout(() => {
    btn.classList.remove('copied');
    label.textContent = originalText;
    icon.className = originalIconClass;
  }, 2000);
}

/* --------------------------------------------------------------------------
   4. Theme Switcher (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;

  // Retrieve cached user preference, or check matching system profile
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Set theme attribute on html root
  htmlElement.setAttribute('data-theme', currentTheme);
  updateThemeToggleIcon(currentTheme);

  // Toggle Action
  toggleBtn.addEventListener('click', () => {
    const targetTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateThemeToggleIcon(targetTheme);
  });

  // Keep theme aligned if system preferences change actively
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const systemTheme = e.matches ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', systemTheme);
      updateThemeToggleIcon(systemTheme);
    }
  });
}

/**
 * Changes FontAwesome class representing Sun or Moon icons
 * @param {string} activeTheme - 'light' or 'dark'
 */
function updateThemeToggleIcon(activeTheme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (!icon) return;

  if (activeTheme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}
