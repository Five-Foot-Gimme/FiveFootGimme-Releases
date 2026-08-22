// Five Foot Gimme — Interactive Site JS

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch Latest Release Version and Update Download Links
  fetchLatestRelease();

  // 2. FAQ Accordion Toggle
  initFAQAccordion();

  // 3. Newsletter Submission
  initNewsletterForm();
});

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
      const winAsset = release.assets.find(a => a.name.includes('windows'));
      const macAsset = release.assets.find(a => a.name.includes('macOS') || a.name.includes('darwin'));

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

// Handle Newsletter Subscription
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input ? input.value : '';

    if (email) {
      form.innerHTML = `<p style="color: #34d399; font-weight: 600; text-align: center;">Thank you for joining our community!</p>`;
    }
  });
}
