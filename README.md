# Reuzenarbeid

Historische foto’s, kaarten en teksten over de bouw van het moderne Nederland (1861–1918), naar het boek van Willem van der Ham. Contentpakket voor [Allmaps Slides](https://github.com/allmaps/slides).

## Making changes

- Edit chapters in `slideshows/00-main/`; numeric filename prefixes set their order, carried over from `_data/projects.yml`.
- Edit the overall title, description, shared map layers and Dutch interface text in `slides.config.yml`.
- The introduction is `slideshows/00-main/00-introductie.md`; credits are in `credits.md`.
- Project routes are in `assets/geojson/projects.geojson`. Their SimpleStyle properties define the shared layer’s appearance in the app and thumbnails.
- Figures use external IIIF Image API services with `data-image` and preserve the original crops with `data-region`. Caption links point to the heritage object and its **zero-based** canvas index (`?id=…`). Paintings use their current heritage object IDs. The Nieuwe Waterweg panorama is not in the two heritage collections; its caption retains the Wikimedia/Rijkswaterstaat source.

The conversion replaces Jekyll’s templates and runtime. The original files remain in Git history. Texts, project order, illustrations and georeferenced-map sources are preserved; `animateToMapBounds` is omitted.

## Running locally

Use Node 24 and pnpm 10. From the Slides repository:

```sh
pnpm install
pnpm exec slides validate ./content/reuzenarbeid
pnpm exec slides dev ./content/reuzenarbeid
```

## Building

```sh
pnpm exec slides thumbnails ./content/reuzenarbeid
pnpm exec slides build ./content/reuzenarbeid
pnpm exec slides preview ./content/reuzenarbeid
```

Local IIIF generation is disabled: the illustrations already have hosted IIIF services and the cover is served directly. Thumbnail generation remains enabled. The Protomaps key is shared with Gravity at Sea.

Pushes to `main` deploy to GitHub Pages using the shared Slides app. The workflow can also be run manually; `SLIDES_REF` selects the framework revision.

## Origins

Based on [The Changing Shoreline of New York City](http://spacetime.nypl.org/the-changing-shoreline-of-nyc/).

Inspired by [Travel the path of the solar eclipse](https://www.washingtonpost.com/graphics/national/mapping-the-2017-eclipse).
