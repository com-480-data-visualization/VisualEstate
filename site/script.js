import { MAPBOX_TOKEN } from './config.js';

window.onload = function () {
  mapboxgl.accessToken = MAPBOX_TOKEN

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    projection: 'globe',
    zoom: 1,
    center: [0, 20],
    pitch: 0,
    bearing: 0
  });

  map.on('style.load', () => {
    map.setFog({
      'color': 'rgba(255,255,255,0.01)',
      'high-color': '#add8e6',
      'space-color': 'rgba(0,0,0,0)',
      'horizon-blend': 0.025
    });
  });
};