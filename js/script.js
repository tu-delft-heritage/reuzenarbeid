/* global CustomEvent, IntersectionObserver, fetch,
  ol, tileUrl */

import Map from "https://cdn.skypack.dev/ol@8.2.0/Map.js"
import View from 'https://cdn.skypack.dev/ol@8.2.0/View.js';
import VectorSource from "https://cdn.skypack.dev/ol@8.2.0/source/Vector.js"
import VectorLayer from 'https://cdn.skypack.dev/ol@8.2.0/layer/Vector.js';
import GeoJSON from "https://cdn.skypack.dev/ol@8.2.0/format/GeoJSON.js"
import TileLayer from 'https://cdn.skypack.dev/ol@8.2.0/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol@8.2.0/source/OSM.js';
import { defaults as defaultInteractions } from 'https://cdn.skypack.dev/ol@8.2.0/interaction.js';
import { Style, Stroke } from 'https://cdn.skypack.dev/ol@8.2.0/style.js';
import { getCenter } from 'https://cdn.skypack.dev/ol@8.2.0/extent';
import { fromLonLat, transformExtent } from 'https://cdn.skypack.dev/ol@8.2.0/proj.js';
import { WarpedMapLayer, WarpedMapSource } from 'https://cdn.skypack.dev/pin/@allmaps/openlayers@v1.0.0-beta.66-hDZUw4BIa9BFzO15OFnl/mode=imports,min/optimized/@allmaps/openlayers.js'

const animateDuration = 2000

const initialView = {
  center: fromLonLat([4.922, 52.362]),
  zoom: 7
}

let vectorLayer
let geojson

const warpedMapSource = new WarpedMapSource()
const warpedMapLayer = new WarpedMapLayer({
  source: warpedMapSource
})

async function fetchJSON(url) {
  const response = await fetch(url)
  const json = await response.json()
  return json
}

async function loadGeoJSON() {
  geojson = await fetchJSON('projects.geojson')

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geojson, {
      featureProjection: 'EPSG:3857'
    })
  })

  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: '#5e7a85',
        width: 5
      })
    })
  })

  vectorLayer.setZIndex(100)

  map.addLayer(vectorLayer)
}

function removeWarpedMapLayer() {
  if (vectorLayer) {
    vectorLayer.setVisible(true)
  }

  warpedMapLayer.setOpacity(0)
  warpedMapSource.clear()
}

async function loadAndParseAnnotation(annotationUrl) {
  const maps = parseAnnotation(await fetchJSON(annotationUrl))
  return maps
}

function animateToGeoJSON(projectId) {
  if (!geojson) {
    return
  }

  const projectFeature = geojson.features
    .filter((feature) => feature.properties.id === projectId)[0]

  if (!projectFeature) {
    throw new Error(`No GeoJSON feature found for project ID ${projectId}`)
  }

  const view = map.getView()

  const extent = transformExtent(new VectorSource({
    features: new GeoJSON().readFeatures(projectFeature.geometry)
  }).getExtent(), 'EPSG:4326', 'EPSG:3857')

  const resolution = view.getResolutionForExtent(extent)
  const zoom = view.getZoomForResolution(resolution)
  const center = getCenter(extent)

  view.animate({
    center,
    zoom: zoom - 0.1,
    duration: animateDuration
  })
}

async function showMap(annotationUrl, animateToMapBounds = false) {

  await warpedMapSource.addGeoreferenceAnnotationByUrl(annotationUrl)

  if (animateToMapBounds) {
    const extent = warpedMapSource.getExtent()
    const view = map.getView()
    const resolution = view.getResolutionForExtent(extent)
    const zoom = view.getZoomForResolution(resolution)
    const center = getCenter(extent)

    view.animate({
      center,
      zoom: zoom - 0.1,
      duration: animateDuration
    })
  }

  window.setTimeout(() => {
    vectorLayer.setVisible(false)
    warpedMapLayer.setOpacity(1)
  }, animateToMapBounds ? animateDuration : 0)
}

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    warpedMapLayer
  ],
  view: new View({
    enableRotation: false,
    ...initialView
  }),
  interactions: defaultInteractions({
    mouseWheelZoom: false,
    dragPan: false
  })
})

loadGeoJSON()

window.addEventListener('project-show-geojson', (event) => {
  removeWarpedMapLayer()

  const projectId = event.detail.projectId
  animateToGeoJSON(projectId)
})

window.addEventListener('project-show-map', async (event) => {

  const annotationId = event.detail.annotationId
  const projectId = event.detail.projectId
  const animateToMapBounds = event.detail.animateToMapBounds

  if (annotationId && projectId) {
    const annotationUrl = `https://annotations.allmaps.org/images/${annotationId}`
    showMap(annotationUrl, animateToMapBounds)
  }
})

window.addEventListener('show-overview', (event) => {
  removeWarpedMapLayer()

  const view = map.getView()
  view.animate({
    ...initialView,
    duration: animateDuration
  })
})

function handleIntersect(entries, observer) {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      const eventName = entry.target.dataset.triggerEvent

      const event = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: false
      })

      document.dispatchEvent(event)
    }
  })
}

const observer = new IntersectionObserver(handleIntersect)
const triggers = document.querySelectorAll('.trigger')
triggers.forEach((trigger) => observer.observe(trigger))

// function disableDragPan () {
//   dragPanEnabled = false
// }

// if ('ontouchstart' in window) {
//   disableDragPan()
//   map.addControl(panControl, 'bottom-right')
// }
