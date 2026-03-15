# Archaeolab - Archaeology Project Management

Static web app for recording shovel test pits (STPs), strata, and exporting field-ready data.

## Project Structure

- index.html: Application markup
- app.css: Styling
- app.js: App logic (local storage, exports, project library)
- .github/workflows/deploy-pages.yml: GitHub Pages deployment workflow
- .nojekyll: Disables Jekyll processing on GitHub Pages

## Local Testing

Open index.html in a browser.

## Publish To GitHub Pages (Recommended)

This repository includes an automatic Pages workflow.

### 1) Push to GitHub

- Create a new GitHub repository.
- Upload/push all files in this folder.
- Use main as the default branch.

### 2) Enable GitHub Pages

- Open repository Settings -> Pages.
- For Source, select GitHub Actions.

### 3) Deploy

- Push to main.
- GitHub Actions will publish the site automatically.

## Notes For Testers

- Data is stored in each tester's browser local storage.
- Saved projects and uploaded map images are browser-local and not shared between users.

## Optional: Install Git On This Machine

Git was not available in this terminal session. If you want command-line push support, install Git for Windows:
https://git-scm.com/download/win
