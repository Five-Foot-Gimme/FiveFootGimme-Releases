# FiveFootGimme Website (`website/`)

This directory contains the static marketing, app download, and session booking website for FiveFootGimme, hosted at [`https://fivefootgimme.com`](https://fivefootgimme.com).

## Purpose

The website serves as the public storefront and customer onboarding portal for the FiveFootGimme SaaS:
1. **Desktop App Distribution**: Dynamically fetches the latest release tag and OS binary download URLs (`FiveFootGimme-windows-amd64.zip` and `FiveFootGimme-macOS-universal.zip`) from the public GitHub Releases API (`https://api.github.com/repos/Five-Foot-Gimme/FiveFootGimme-Releases/releases/latest`), with static fallback links to `/releases/latest/download/...`.
2. **Session Booking & Payment**: Embeds an inline and pop-up **Calendly** widget (`https://calendly.com/dclayto32`) where customers reserve and pay for cloud simulator timeslots. Completing a booking fires a Calendly webhook to the Azure Logic App that schedules `GimmeCloud1` and emails the player their `sessionID`.
3. **Onboarding & FAQ**: Explains the 4-step workflow (*Download → Book Session → Get Session ID → Launch*), showcases the MLM2PRO demo video, and answers common questions (supported launch monitors, per-machine GSPro licensing, ephemeral player data, and resetting GSPro Connect).
4. **Lead Capture & Conversion Attribution**:
   - Captures newsletter/lead emails via **Formspree** (`#lead-form`).
   - Tracks full-funnel conversion events (`PageVisit`, `Lead`, `Purchase`, `Web Booking Timeslot Selected`, `Web Booking Completed`, `Download Windows App`, `Download Mac App`, and demo video plays) via **Reddit Pixel (`window.rdt`)**, including email Advanced Matching and payment value metadata extracted from Calendly `postMessage` events.

---

## Directory Structure

```
website/
├── CNAME                                    # Custom domain configuration (fivefootgimme.com)
├── index.html                               # Main landing page HTML (Hero, How It Works, Calendly Booking, FAQ, Footer)
├── style.css                                # Vanilla CSS stylesheet (responsive layout, dark theme, animations)
├── app.js                                   # Client-side logic (GitHub release fetcher, FAQ accordion, Calendly & Reddit Pixel tracking)
└── assets/
    └── FiveFootGimme_MLM2PRO_Website.mp4    # Embedded product demo video
```

---

## Deployment Pipeline (`.github/workflows/deploy-pages.yml`)

The website is deployed automatically via GitHub Actions whenever files in `website/**` change:
- **Pull Request Staging Preview**: Opening or updating a PR against `main` deploys `./website` to the private repository's GitHub Pages environment for staging inspection.
- **Production Deployment**: Merging to `main` clones the public `Five-Foot-Gimme/FiveFootGimme-Releases` repository using `PUBLIC_RELEASES_PAT`, syncs `website/*` to the root of its `main` branch, and pushes—updating the live site at `https://fivefootgimme.com`.
