# Project Overview

This project is a personal CV website for Daniel Kirsch, built using the [Hugo](https://gohugo.io/) static site generator. The site's content is managed through a set of YAML files in the `data` directory, and the layout is defined using Go HTML templates in the `layouts` directory. The styling is done with SCSS and processed by Hugo Pipes. The site is deployed to GitHub Pages via a GitHub Actions workflow.

# Building and Running

## Prerequisites

- Install [Hugo](https://gohugo.io/) (v0.152+ recommended)
- Install [Node.js](https://nodejs.org/)

## Commands

Install dependencies (one time only):

```bash
npm install
```

Start the development server:

```bash
hugo server
```

To build the site for production (including minification):

```bash
hugo --minify
```

To generate a PDF version of the CV:

```bash
npm run pdf
```

The generated PDF will be located at `static/daniel-kirsch-cv.pdf`.

# Development Conventions

- **Content**: All CV data is stored in YAML files within the `data` directory. This separation of content and presentation is a core principle of the project.
- **Styling**: SCSS is used for styling and is processed by Hugo's asset pipeline. The main SCSS file is located at `assets/scss/main.scss`.
- **Templates**: The website's structure and layout are defined by Go HTML templates in the `layouts` directory.
- **Static Assets**: Images, fonts, and other static files are stored in the `static` directory.
- **Deployment**: The site is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

# Key Files

- `hugo.yaml`: The main configuration file for the Hugo site.
- `package.json`: Defines the Node.js dependencies and scripts used for development and building the site.
- `data/`: This directory contains the structured data for the CV in YAML format.
  - `cv.yaml`: Personal information and abstract.
  - `experience.yaml`: Work experience.
  - `education.yaml`: Education history.
  - `interests.yaml`: Personal interests.
  - `references.yaml`: References.
  - `voluntary.yaml`: Voluntary work.
- `layouts/`: This directory contains the Go HTML templates that define the structure of the website.
- `assets/scss/`: This directory contains the SCSS files for styling the website.
- `static/`: This directory contains static assets like images and PDFs.
- `scripts/generate-pdf.js`: The script used to generate the PDF version of the CV.