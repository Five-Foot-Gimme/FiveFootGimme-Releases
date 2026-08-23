// Five Foot Gimme — Interactive Site JS

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch Latest Release Version and Update Download Links
  fetchLatestRelease();

  // 2. FAQ Accordion Toggle
  initFAQAccordion();

  // 3. Lead Form Submission (Formspree AJAX fallback)
  initLeadForm();

  // 4. Calendly Pop-Up Widget Trigger
  initCalendlyPopup();
});

// Initialize Calendly Pop-up Widget
function initCalendlyPopup() {
  const bookBtn = document.getElementById('btn-open-calendly');
  if (!bookBtn) return;

  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.Calendly) {
      Calendly.initPopupWidget({
        url: 'https://calendly.com/dclayto32?hide_gdpr_banner=1&background_color=0f172a&text_color=047857&primary_color=10b981'
      });
    } else {
      window.open('https://calendly.com/dclayto32', '_blank');
    }
  });
}

// Fetch latest tag and asset download links from public GitHub releases repo
async function fetchLatestRelease() {
  const badgeElement = document.getElementById('release-version-badge');
  const btnWindows = document.getElementById('btn-windows');
  const btnMacos = document.getElementById('btn-macos');

  const repoOwner = 'Five-Foot-Gimme';
  const repoName = 'FiveFootGimme-Releases';
  const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const release = await response.json();
    const tagName = release.tag_name || 'Latest';

    if (badgeElement) {
      badgeElement.innerHTML = `Latest Version: <strong>${tagName}</strong>`;
    }

    // Find specific OS binary assets in release
    if (release.assets && Array.isArray(release.assets)) {
      const winAsset = release.assets.find(a => a.name.toLowerCase().includes('win'));
      const macAsset = release.assets.find(a => a.name.toLowerCase().includes('mac') || a.name.toLowerCase().includes('darwin'));

      if (winAsset && btnWindows) {
        btnWindows.href = winAsset.browser_download_url;
      }
      if (macAsset && btnMacos) {
        btnMacos.href = macAsset.browser_download_url;
      }
    }
  } catch (error) {
    console.warn('Could not fetch latest release dynamically, using default download links:', error);
    if (badgeElement) {
      badgeElement.textContent = 'Latest Version Download Available';
    }
  }
}

// Accordion toggle for FAQ items
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
}

// Handle Lead / Subscription Form
function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input ? input.value : '';

    if (!email) return;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.innerHTML = `<p style="color: #34d399; font-weight: 600; text-align: center; padding: 12px;">Thank you! We've received your request.</p>`;
      } else {
        form.innerHTML = `<p style="color: #34d399; font-weight: 600; text-align: center; padding: 12px;">Thank you for subscribing!</p>`;
      }
    } catch (err) {
      form.innerHTML = `<p style="color: #34d399; font-weight: 600; text-align: center; padding: 12px;">Thank you for subscribing!</p>`;
    }
  });
}
