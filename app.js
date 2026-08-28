document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch Latest Release Version and Update Download Links
  fetchLatestRelease();

  // 2. FAQ Accordion Toggle
  initFAQAccordion();

  // 3. Lead Form Submission (Formspree AJAX fallback)
  initLeadForm();

  // 4. Calendly Pop-Up Widget Trigger
  initCalendlyPopup();

  // 5. App Download Tracking
  initDownloadTracking();

  // 6. Demo Video View Tracking
  initVideoTracking();

  // 7. Calendly Booking Embed Event Tracking
  initCalendlyTracking();
});

// Initialize Calendly Pop-up Widget
function initCalendlyPopup() {
  const bookBtn = document.getElementById('btn-open-calendly');
  if (!bookBtn) return;

  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.rdt) {
      window.rdt('track', 'Custom', { customEventName: 'Booking Button Clicked' });
    }
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

// Handle Lead / Subscription Form with Reddit Pixel tracking
function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input ? input.value.trim().toLowerCase() : '';

    if (!email) return;

    if (window.rdt) {
      window.rdt('track', 'Lead', { email: email });
    }

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

// Track Windows and Mac App Downloads
function initDownloadTracking() {
  const btnWindows = document.getElementById('btn-windows');
  const btnMacos = document.getElementById('btn-macos');

  if (btnWindows) {
    btnWindows.addEventListener('click', () => {
      if (window.rdt) {
        window.rdt('track', 'Custom', { customEventName: 'Download Windows App' });
      }
    });
  }

  if (btnMacos) {
    btnMacos.addEventListener('click', () => {
      if (window.rdt) {
        window.rdt('track', 'Custom', { customEventName: 'Download Mac App' });
      }
    });
  }
}

// Track Video Playback (Custom event on video start)
function initVideoTracking() {
  const videoPlayer = document.querySelector('.demo-video-player');
  if (!videoPlayer) return;

  let trackedPlay = false;
  videoPlayer.addEventListener('play', () => {
    if (!trackedPlay) {
      trackedPlay = true;
      if (window.rdt) {
        window.rdt('track', 'Custom', {
          customEventName: 'FiveFootGimme MLM2PRO Demo Video'
        });
      }
    }
  });
}

// Track Calendly iframe postMessage events (Timeslot selection & completed bookings)
function initCalendlyTracking() {
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;

    const eventName = e.data.event;

    if (eventName === 'calendly.date_and_time_selected') {
      if (window.rdt) {
        window.rdt('track', 'Custom', { customEventName: 'Web Booking Timeslot Selected' });
      }
    } else if (eventName === 'calendly.event_scheduled') {
      const payload = e.data.payload;
      const email = payload?.invitee?.email ? payload.invitee.email.trim().toLowerCase() : undefined;

      // Extract payment info if present
      const paymentInfo = payload?.invitee?.payment || payload?.payment;
      let paidAmount;
      let paidCurrency = 'USD';

      if (paymentInfo?.amount !== undefined && paymentInfo?.amount !== null) {
        paidAmount = typeof paymentInfo.amount === 'number'
          ? paymentInfo.amount
          : parseFloat(paymentInfo.amount);

        if (paymentInfo.currency) {
          paidCurrency = String(paymentInfo.currency).toUpperCase();
        }
      }

      const metadata = {
        currency: paidCurrency,
        itemCount: 1,
        ...(email ? { email } : {}),
        ...(paidAmount !== undefined && !isNaN(paidAmount) ? { value: paidAmount } : {})
      };

      if (window.rdt) {
        window.rdt('track', 'Purchase', metadata);
        window.rdt('track', 'Custom', {
          customEventName: 'Web Booking Completed',
          ...metadata
        });
      }
    }
  });
}

