window.onload = function () {
  
  if (document.getElementById('map')) {
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
        'horizon-blend': 0.025,
      });
    });
  };

};

document.addEventListener('DOMContentLoaded', () => {
  gsap.to(".nav-underline", {
    width: "100%",
    duration: 1,
    ease: "power2.out"
  });
});



document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".fade-in-up").forEach(elem => {
    gsap.fromTo(elem,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 100%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  gsap.to(".intro-text .emphasis", {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: "back.out(1.7)",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".intro-text p",
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  }
);


  // Counter
  function animateCount(el, target, duration = 1000) {
    let start = 0;
    const stepTime = Math.max(duration / target, 20);
    const step = () => {
      start++;
      el.textContent = start;
      if (start < target) setTimeout(step, stepTime);
    };
    step();
  }



 function scrollToNextSection() {
    const currentSection = document.querySelector(".section");
    const nextSection = currentSection.nextElementSibling;

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.counter span').forEach(span => {
          const target = +span.getAttribute('data-count');
          animateCount(span, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const countersContainer = document.querySelector('.counters');
  if (countersContainer) observer.observe(countersContainer);
});

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

 document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".scroll-down").forEach(button => {
      button.addEventListener("click", () => {
        const currentSection = button.closest(".section");
        const nextSection = currentSection.nextElementSibling;

        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  });


