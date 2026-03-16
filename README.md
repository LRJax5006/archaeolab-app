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

## Short Tester Guide

1. Open the live app and confirm all sections load.
2. Create one STP with at least two strata and save it.
3. Upload stratum photos and verify names are auto-generated, editable, and deletable.
4. Save the session as a project, then load that project.
5. Export XLSX and CSV to confirm downloads work.

When reporting bugs, include browser/device, exact steps, expected result, actual result, and a screenshot if possible.

## Optional: Install Git On This Machine

Git was not available in this terminal session. If you want command-line push support, install Git for Windows:
https://git-scm.com/download/win
