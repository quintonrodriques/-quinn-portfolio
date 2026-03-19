# Quinn Portfolio — Setup & Deployment Guide

Your portfolio is built with **Next.js** (React framework) and connects to **Sanity** as a CMS.
Once deployed, you manage all content — projects, images, bio — from a clean dashboard at your Sanity Studio URL.

---

## What you need
- A free account at [sanity.io](https://sanity.io)
- A free account at [vercel.com](https://vercel.com)
- [Node.js](https://nodejs.org) installed (v18 or higher)
- A terminal / command line

---

## Step 1 — Install dependencies

Open a terminal in this folder and run:

```bash
npm install
```

---

## Step 2 — Create your Sanity project

1. Go to [sanity.io/manage](https://sanity.io/manage) and sign in
2. Click **"New Project"**
3. Name it `quinn-portfolio`
4. Choose **"Empty project"**
5. Select dataset name: `production`
6. Copy your **Project ID** (looks like `abc123de`)

---

## Step 3 — Connect Sanity to your site

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and paste your Project ID:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

---

## Step 4 — Install and deploy Sanity Studio

Sanity Studio is your content editor. Install it globally:

```bash
npm install -g @sanity/cli
```

Then initialise the studio inside this project:

```bash
cd sanity
sanity init --project your_project_id_here --dataset production
```

Copy the schemas into the studio:

```bash
# The schema files are already in sanity/schemas/
# Just make sure sanity.config.js imports them (see below)
```

Create `sanity/sanity.config.js`:

```js
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './index'

export default defineConfig({
  name: 'quinn-portfolio',
  title: 'Quinn Portfolio',
  projectId: 'your_project_id_here',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes },
})
```

Deploy the studio:

```bash
cd sanity
sanity deploy
```

Choose a studio URL, e.g. `quinn` → your studio will be at `quinn.sanity.studio`

---

## Step 5 — Add your first project in Sanity

1. Open your Sanity Studio URL (e.g. `quinn.sanity.studio`)
2. Click **"Project"** in the left sidebar
3. Click **"+ New Project"**
4. Fill in:
   - **Title**: e.g. `Meridian Analytics`
   - **Category**: UI Design or UX Design
   - **Type**: e.g. `Dashboard`
   - **Year**: e.g. `2026`
   - **Description**: short card text
   - **Thumbnail Image**: drag and drop or upload from your computer
   - **Gallery Slides**: add up to 5 images, each with a label and caption
5. Click **Publish**

Your site will reflect the new content within 60 seconds of publishing.

---

## Step 6 — Run locally to preview

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your site pulls live from Sanity.

---

## Step 7 — Deploy to Vercel (free hosting)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Quinn portfolio"
   git remote add origin https://github.com/yourusername/quinn-portfolio.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"**
4. Select your `quinn-portfolio` repository
5. Under **"Environment Variables"**, add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
6. Click **"Deploy"**

Vercel gives you a free URL like `quinn-portfolio.vercel.app`.
You can connect a custom domain (e.g. `quinn.design`) for free in Vercel settings.

---

## How to add content going forward

### Add a new project
1. Open your Sanity Studio
2. Click **Project → + New Project**
3. Fill in details and upload images
4. Click **Publish** — live within 60 seconds

### Edit your bio or skills
1. Open Sanity Studio
2. Click **About / Bio**
3. Edit any field and click **Publish**

### Reorder projects
Each project has an **"Order"** field — lower numbers appear first.

---

## File structure

```
quinn-portfolio/
├── pages/
│   ├── _app.js          # App wrapper
│   └── index.js         # Main page (pulls from Sanity)
├── components/
│   └── Gallery.js       # Lightbox gallery component
├── lib/
│   └── sanity.js        # Sanity client + queries
├── styles/
│   └── globals.css      # All Quinn v3 styles
├── sanity/
│   ├── schemas/
│   │   ├── project.js   # Project content schema
│   │   └── about.js     # Bio/about schema
│   └── index.js         # Schema exports
├── .env.example         # Environment variable template
├── next.config.js
└── package.json
```

---

## Notes

- **Images** are hosted on Sanity's CDN automatically — no separate image hosting needed
- **The site works without Sanity** — it falls back to placeholder content until you connect
- **Free tier limits**: Sanity free = 20GB storage, unlimited entries. Vercel free = unlimited deploys for personal projects.
