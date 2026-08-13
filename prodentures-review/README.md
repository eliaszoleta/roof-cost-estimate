# Prodentures — Review Funnel

A single self-contained page (`index.html`, no build step) that asks a patient to
rate their visit, then branches:

- **4–5 stars** → shows a "Thank you!" message for 3 seconds, then
  auto-redirects (same tab) to Prodentures' Google review page.
- **1–3 stars** → shows a private feedback form instead. It's emailed to you
  (via [Web3Forms](https://web3forms.com), no backend needed) and the patient
  sees a "thank you, we'll do better" screen. Nothing negative ever reaches Google.

## Setup (5 minutes)

1. **Google review link** — already wired in `index.html` under `CONFIG.googleReviewUrl`.
2. **Private feedback delivery** — go to [web3forms.com](https://web3forms.com),
   sign up free, verify the email you want feedback sent to, and copy your
   **Access Key**. Paste it into `CONFIG.web3formsAccessKey` in `index.html`
   (replace `YOUR_WEB3FORMS_ACCESS_KEY_HERE`).
   - Until you do this, the "unhappy" form still shows the thank-you screen,
     it just won't email you — so don't skip this step.

## Deploying

This is a static page — any of these work, free tier is plenty:

- **Vercel**: `vercel deploy` from this folder, or drag-and-drop the folder at vercel.com/new.
- **Netlify**: drag-and-drop the folder at app.netlify.com/drop.
- **GitHub Pages**: push this folder to a repo and enable Pages on it.

Once deployed, point a short link or QR code at the URL (e.g. printed on a
receipt, a tablet at checkout, or a follow-up SMS/email after an appointment).

## Embedding inside GoHighLevel

`ghl-custom-code.html` is the same page, repackaged to paste into a GHL
funnel/website page's **Custom Code** element instead of hosting it as its
own URL. Every class and ID is prefixed (`pdr-...`) and scoped under a single
`#pdr-widget` wrapper so it can't collide with GHL's own page styles in
either direction. Config (Google link, Web3Forms key) is the same block
near the bottom of the file — edit it there too, independently of
`index.html`, since the two files aren't auto-synced.

Paste the whole file's contents into the Custom Code element as-is (it
includes its own `<style>` and `<script>` tags).

## A note on Google's policy

Google's guidelines discourage "review gating" — steering only happy
customers to leave a public review while diverting unhappy ones elsewhere.
Enforcement against small local businesses is rare, but it's worth knowing.
If you'd rather stay strictly compliant, a safer variant is to send *everyone*
to Google, and use this page purely to draft/copy a suggested review for happy
patients while still collecting private feedback as a secondary "how can we
improve?" prompt rather than a hard fork.
