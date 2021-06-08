/* global CustomEvent, IntersectionObserver, fetch,
  ol, annotation, transform, allmapsLayers,
  tileUrl */

const animateDuration = 2000

const initialView = {
  center: ol.proj.fromLonLat([4.922, 52.362]),
  zoom: 7
}

let vectorLayer
let warpedMapLayer
let geojson

async function fetchJSON (url) {
  const response = await fetch(url)
  const json = await response.json()
  return json
}

async function fetchImage (imageUri) {
  const json = await fetchJSON(`${imageUri}/info.json`)
  return json
}

async function loadGeoJSON () {
  geojson = await fetchJSON('projects.geojson')

  const vectorSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojson, {
      featureProjection: 'EPSG:3857'
    })
  })

  vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#5e7a85',
        width: 5
      })
    })
  })

  vectorLayer.setZIndex(100)

  map.addLayer(vectorLayer)
}

function removeWarpedMapLayer () {
  if (vectorLayer) {
    vectorLayer.setVisible(true)
  }

  if (warpedMapLayer) {
    map.removeLayer(warpedMapLayer)
    warpedMapLayer.destroy()

    warpedMapLayer = undefined
  }
}

async function loadAndParseAnnotation (annotationUrl) {
  const maps = annotation.parse(await fetchJSON(annotationUrl))
  return maps
}

function animateToGeoJSON (projectId) {
  if (!geojson) {
    return
  }

  const projectFeature = geojson.features
    .filter((feature) => feature.properties.id === projectId)[0]

  if (!projectFeature) {
    throw new Error(`No GeoJSON feature found for project ID ${projectId}`)
  }

  const view = map.getView()

  const extent = ol.proj.transformExtent(new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(projectFeature.geometry)
  }).getExtent(), 'EPSG:4326', 'EPSG:3857')

  const resolution = view.getResolutionForExtent(extent)
  const zoom = view.getZoomForResolution(resolution)
  const center = ol.extent.getCenter(extent)

  view.animate({
    center,
    zoom: zoom - 0.1,
    duration: animateDuration
  })
}

async function animateToMapExtent (maps) {
  const firstMap = maps[0]

  const imageUri = firstMap.image.uri
  const image = await fetchImage(imageUri)

  const options = {
    image,
    georeferencedMap: firstMap,
    source: new ol.source.Vector()
  }

  const transformArgs = transform.createTransformer(firstMap.gcps)
  const polygon = firstMap.pixelMask
    .map((point) => transform.toWorld(transformArgs, point))

  const geoMask = {
    type: 'Polygon',
    coordinates: [polygon]
  }

  const extent = ol.proj.transformExtent(new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geoMask)
  }).getExtent(), 'EPSG:4326', 'EPSG:3857')

  const view = map.getView()
  const resolution = view.getResolutionForExtent(extent)
  const zoom = view.getZoomForResolution(resolution)
  const center = ol.extent.getCenter(extent)

  view.animate({
    center,
    zoom: zoom - 0.1,
    duration: animateDuration
  })

  window.setTimeout(() => {
    vectorLayer.setVisible(false)
    warpedMapLayer = new allmapsLayers.WarpedMapLayer(options)
    map.addLayer(warpedMapLayer)
  }, animateDuration)
}

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: tileUrl
      })
    })
  ],
  view: new ol.View({
    enableRotation: false,
    ...initialView
  }),
  interactions: new ol.interaction.defaults({
    mouseWheelZoom: false,
    dragBox: false,
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
  removeWarpedMapLayer()

  const annotationId = event.detail.annotationId
  const projectId = event.detail.projectId

  if (annotationId && projectId) {
    const annotationUrl = `https://annotations.allmaps.org/images/${annotationId}`
    const maps = await loadAndParseAnnotation(annotationUrl)
    animateToMapExtent(maps)
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

function handleIntersect (entries, observer) {
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
