# Deploying AI Engineering Copilot to GitHub Pages

If your site was showing a **blank white page** on GitHub Pages, it was caused by **absolute asset path resolution (`/assets/...`)** instead of repository-relative paths (`./assets/...`).

GitHub Pages serves sites from a repository subpath by default (e.g. `https://<username>.github.io/<repository-name>/`), whereas standard Vite builds look for assets at the root (`https://<username>.github.io/assets/...`), returning 404 for the JavaScript and CSS bundle.

We have updated `vite.config.ts` with `base: process.env.BASE_URL || './'` so asset paths will now resolve properly on any GitHub Pages URL!

---

## Recommended Deployment via GitHub Actions (Automatic)

Create a file in your repository at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main'] # or 'master'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### In GitHub Settings:
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push your code or run the workflow. Your site will deploy live at `https://<username>.github.io/<repository-name>/`.
