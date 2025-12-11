# CV Daniel Kirsch

## Develop

### Prerequisites
- Install [Hugo](https://gohugo.io/) (v0.152+ recommended)

### Commands

Install dependencies (one time only):

    npm install

Start development server:

    hugo server

Or with live reload:

    hugo server --buildDrafts

Build for production:

    hugo --minify

Generate PDF from the built site:

    npm run pdf

The PDF will be generated at `static/daniel-kirsch-cv.pdf`.

## Publish

The site automatically deploys to GitHub Pages via GitHub Actions when you push to master.

Manual deployment steps:

```bash
git add .
git commit -m "Update CV"
git push origin master
```

The GitHub Actions workflow will automatically build and deploy the site.

## Content Structure

- **CV Data**: Edit YAML files in `data/` directory
  - `cv.yaml` - Personal information and abstract
  - `education.yaml` - Academic background
  - `experience.yaml` - Work experience
  - `voluntary.yaml` - Volunteer work and speaking
  - `interests.yaml` - Interests and personal projects
  - `references.yaml` - References

- **Templates**: `layouts/` directory (Go HTML templates)
- **Styles**: `assets/scss/` directory (SCSS with Hugo Pipes)
- **Static Files**: `static/` directory (images, PDFs, webfonts)

## Technology Stack

- **Static Site Generator**: Hugo (v0.152+)
- **Styling**: SCSS with Hugo Pipes
- **Icons**: Font Awesome 7
- **Fonts**: Google Fonts (Exo 2)
- **Deployment**: GitHub Pages via GitHub Actions
