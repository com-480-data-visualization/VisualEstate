

window.onload = function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZWxib3llciIsImEiOiJjbThyZ3EyZ3owdWV3MmtzNW5qMTBhZTkzIn0.-lYW5GnoaUD1NGkeSbLecg';

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

document.addEventListener('DOMContentLoaded', () => {
  function animateCount(el, target, duration = 1000) {
    let start = 0;
    const stepTime = Math.max(duration / target, 20);
    const step = () => {
      start++;
      el.textContent = start;
      if (start < target) {
        setTimeout(step, stepTime);
      }
    };
    step();
  }

  let hasAnimated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        document.querySelectorAll('.counter span').forEach(span => {
          const target = +span.getAttribute('data-count');
          animateCount(span, target, 1000);
        });
      }
    });
  }, { threshold: 0.5 });

  const countersContainer = document.querySelector('.counters');
  if (countersContainer) {
    observer.observe(countersContainer);
  }
});


