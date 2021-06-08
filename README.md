# Reuzenarbeid

## Making changes

  - Projects (and their properties) can be found in the Markdown files in the [`_projects`](_projects) directory;
  - The order in which the areas appear can be changed in [`_data/projects.yml`](_data/projects.yml);
  - The GeoJSON polygons are in [`_includes/projects.geojson`](_includes/projects.geojson).

_To add or modify a project, edit the project's Markdown file and ensure the project is listed in both[`_data/projects.yml`](_data/projects.yml) and [`_includes/projects.geojson`](_includes/projects.geojson)._

The header and footer text can be found in the [`_includes`](_includes) directory.

Based on [The Changing Shoreline of New York City](http://spacetime.nypl.org/the-changing-shoreline-of-nyc/).

Inspired by [Travel the path of the solar eclipse](https://www.washingtonpost.com/graphics/national/mapping-the-2017-eclipse).

## Running locally

Run:

    jekyll serve --livereload --incremental --baseurl "/"
