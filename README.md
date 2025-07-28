# `create-preact`

<h2 align="center">
  <img height="256" width="256" src="./src/assets/preact.svg">
</h2>

<h3 align="center">Get started using Preact and Vite!</h3>

## Getting Started

-   `npm run dev` - Starts a dev server at http://localhost:5173/

-   `npm run build` - Builds for production, emitting to `dist/`. Prerenders all found routes in app to static HTML

-   `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally

## Environment variables

This project expects the following variables at build time:

- `VITE_GOOGLE_CLIENT_ID` – Google OAuth client ID
- `VITE_API_URL` – Base URL of the backend API

## Deploy to GitHub Pages

When building for GitHub Pages the site uses relative URLs by
setting `base: './'` in `vite.config.ts`. The production build can be
deployed by publishing the contents of the `dist/` folder.
