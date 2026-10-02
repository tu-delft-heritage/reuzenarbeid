# Content and migration notes

## Editing and sources

Chapters in `slideshows/00-main/` follow numeric filename order, carried over from
`_data/projects.yml`. The introduction is `00-introductie.md`; shared credits are
in `credits.md`. Project routes live in `assets/geojson/projects.geojson`, where
SimpleStyle properties control their appearance in the app and thumbnails.

Figures use `data-image` for IIIF services and `data-region` to preserve crops.
Caption links point to the heritage object and its **zero-based** canvas index
(`?id=…`). Paintings use their current heritage object IDs. The Nieuwe Waterweg
panorama is local, with its Wikimedia/Rijkswaterstaat source retained in the caption.

Local originals are organized by collection under `assets/images/`.
Georeference annotations live in `assets/annotations/`; `assets/imports.json`
records source URLs and dimensions. Relative image paths inside annotations
resolve to the site's IIIF services when served. Other illustrations can still
use external IIIF services directly.

The conversion replaces Jekyll's templates and runtime; the original files remain
in Git history. Texts, project order, illustrations and georeferenced-map sources
are preserved. The former `animateToMapBounds` setting is omitted.

## Generation and deployment

IIIF and thumbnails are enabled. Builds generate both; during development use
`slides iiif` after changing local images and `slides thumbnails` to refresh map
previews. The configured Protomaps key is shared with Gravity at Sea.

The [Pages workflow](../.github/workflows/deploy-pages.yml) runs on pushes to
`main` or by manual dispatch. The Slides version is pinned in `package.json` and `pnpm-lock.yaml`;
see [deployment](deployment.md) for upgrades.
It installs renderer dependencies, restores image caches, exports `dist/site`
and deploys that output. See [Slides deployment](https://github.com/allmaps/slides/blob/main/docs/deployment.md)
for the framework's build requirements.

## Origins

Based on [The Changing Shoreline of New York City](http://spacetime.nypl.org/the-changing-shoreline-of-nyc/).

Inspired by [Travel the path of the solar eclipse](https://www.washingtonpost.com/graphics/national/mapping-the-2017-eclipse).
