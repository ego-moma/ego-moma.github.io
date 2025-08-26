window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})


(function initVideoSlider() {
  const slider = document.getElementById('emma-video-slider');
  if (!slider) return;

  const track = slider.querySelector('.track');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const videos = slides.map(s => s.querySelector('video'));
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');

  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    // Pause all; play current
    videos.forEach((v, k) => {
      if (k === index) {
        v.play().catch(() => {}); // muted autoplay should succeed
      } else {
        v.pause();
        v.currentTime = 0; // optional: reset for a fresh look
      }
    });
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  // Keyboard arrows
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev.click();
    if (e.key === 'ArrowRight') next.click();
  });

  // Basic swipe on touch
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx > 0 ? prev : next).click();
    startX = null;
  });

  // Autoplay the first slide on load
  goTo(0);
})();

// Simple swapping carousel for `.results-carousel` using provided markup
(function initResultsCarousel() {
  document.addEventListener('DOMContentLoaded', function () {
    const root = document.querySelector('.results-carousel');
    if (!root) return;

    const items = Array.from(root.querySelectorAll('.item'));
    const dots = Array.from(root.querySelectorAll('.carousel-dots .dot'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const descriptionEl = document.getElementById('video-description');

    if (!items.length || !prevBtn || !nextBtn || !descriptionEl) return;

    let currentIndex = 0;

    function update() {
      items.forEach((item, i) => {
        const video = item.querySelector('video');
        if (i === currentIndex) {
          item.style.display = 'block';
          if (video) {
            // Ensure autoplay/muted/loop behavior remains consistent
            video.muted = true;
            video.loop = true;
            video.play().catch(() => {});
          }
        } else {
          item.style.display = 'none';
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        }
      });

      if (dots.length) {
        dots.forEach((dot, i) => {
          if (i === currentIndex) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }

      const activeItem = items[currentIndex];
      const desc = activeItem ? activeItem.getAttribute('data-description') : '';
      if (desc) descriptionEl.innerHTML = desc;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      update();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      update();
    });

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          currentIndex = i;
          update();
        });
      });
    }

    // Initialize
    update();
  });
})();
