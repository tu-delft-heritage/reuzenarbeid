# Reuzenarbeid

Historical photographs, maps and stories about the construction of the modern
Netherlands (1861–1918), based on the book by Willem van der Ham.
The site is built with [Allmaps Slides](https://github.com/allmaps/slides).

## Edit the story

- [slideshows/00-main](slideshows/00-main): chapters in numeric filename order.
- [slides.config.yml](slides.config.yml): title, maps and Dutch interface labels.
- [credits.md](credits.md): sources and acknowledgements.
- [assets/geojson/projects.geojson](assets/geojson/projects.geojson): project routes.

[Content notes](docs/content.md) explain image sources, crops, local annotations
and the migration from Jekyll.
See the [Slides authoring guide](https://github.com/allmaps/slides/blob/main/docs/authoring.md)
for the Markdown format.

## Preview and build

Use Node.js 24 or later and pnpm 10. Run from this repository:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

After editing, run `pnpm validate` and `pnpm build`. Builds generate local IIIF
images and map previews automatically. Use `pnpm exec slides iiif .` to refresh
local images during development.

Pushes to `main` run the [GitHub Pages workflow](.github/workflows/deploy-pages.yml).
The Slides version is pinned in `package.json` and `pnpm-lock.yaml`.
See [deployment](docs/deployment.md) for setup, upgrades and cache controls.
