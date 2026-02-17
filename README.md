# Channel19 Website

AI agents for load booking — built with React + Vite.

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option A: Via GitHub (Recommended)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your GitHub repo
4. Vercel auto-detects Vite — just click "Deploy"
5. Your site will be live at `your-project.vercel.app` in ~60 seconds

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Connect Your Domain (channel19.ai)

1. In Vercel dashboard → your project → Settings → Domains
2. Add `channel19.ai` and `www.channel19.ai`
3. Vercel will show you DNS records to add
4. Go to your domain registrar and update DNS:
   - Add an **A record** pointing to `76.76.21.21`
   - Add a **CNAME** for `www` pointing to `cname.vercel-dns.com`
5. Wait 5-10 minutes for DNS propagation
6. Vercel auto-provisions HTTPS

## Lead Form Setup (Formspree)

The lead capture form is configured to send submissions to `support@channel19.io` via Formspree.

To activate:
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and get your form ID (e.g., `xpznqkdl`)
3. In `src/App.jsx`, replace `https://formspree.io/f/support@channel19.io` with `https://formspree.io/f/YOUR_FORM_ID`

## Calendly Integration

"Book a Demo" buttons scroll to the lead form. After submission, users see a "Schedule on Calendly" button linking to `https://calendly.com/tonysingh/`.
