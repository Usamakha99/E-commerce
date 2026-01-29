import React, { useEffect } from 'react';

const JavaScriptIntegration = () => {
  useEffect(() => {
    // Load external JavaScript files
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // CSS files are now imported directly in main.jsx

    // Load required JavaScript files
    const loadScripts = async () => {
      try {
        await loadScript('/assets/js/vendors/jquery-3.6.0.min.js');
        await loadScript('/assets/js/vendors/bootstrap.bundle.min.js');
        await loadScript('/assets/js/vendors/swiper-bundle.min.js');
        await loadScript('/assets/js/vendors/select2.min.js');
        await loadScript('/assets/js/vendors/slick.js');
        await loadScript('/assets/js/vendors/wow.js');
        await loadScript('/assets/js/vendors/waypoints.js');
        await loadScript('/assets/js/vendors/counterup.js');
        await loadScript('/assets/js/vendors/isotope.js');
        await loadScript('/assets/js/vendors/noUISlider.js');
        await loadScript('/assets/js/vendors/perfect-scrollbar.min.js');
        await loadScript('/assets/js/vendors/magnific-popup.js');
        await loadScript('/assets/js/vendors/scrollup.js');
        await loadScript('/assets/js/vendors/jquery.countdown.min.js');
        await loadScript('/assets/js/vendors/jquery.elevatezoom.js');
        await loadScript('/assets/js/vendors/jquery.theia.sticky.js');
        await loadScript('/assets/js/vendors/slider.js');
        await loadScript('/assets/js/main.js');
        await loadScript('/assets/js/shop.js');
      } catch (_error) {
      }
    };

    loadScripts();

    // Initialize components when scripts are loaded
    const initializeComponents = () => {
      // Initialize Swiper
      if (window.Swiper) {
        // Featured products slider
        new window.Swiper('.swiper-group-3', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '.swiper-button-next-group-3',
            prevEl: '.swiper-button-prev-group-3',
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          },
        });

        // Best seller slider
        new window.Swiper('.swiper-best-seller', {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '.swiper-button-next-bestseller',
            prevEl: '.swiper-button-prev-bestseller',
          },
        });
      }

      // Initialize Select2
      if (window.$ && window.$.fn.select2) {
        window.$('.select-active').select2({
          minimumResultsForSearch: Infinity,
        });
      }

      // Initialize WOW.js
      if (window.WOW) {
        new window.WOW().init();
      }

      // Initialize price range slider
      if (window.noUiSlider) {
        const slider = document.getElementById('slider-range');
        if (slider) {
          window.noUiSlider.create(slider, {
            start: [0, 1000],
            connect: true,
            range: {
              'min': 0,
              'max': 1000
            }
          });

          slider.noUiSlider.on('update', function (values, handle) {
            const minValue = document.querySelector('.min-value-money');
            const maxValue = document.querySelector('.max-value-money');
            if (minValue) minValue.textContent = '$' + Math.round(values[0]);
            if (maxValue) maxValue.textContent = '$' + Math.round(values[1]);
          });
        }
      }

      // Initialize tooltips
      if (window.$ && window.$.fn.tooltip) {
        window.$('[data-bs-toggle="tooltip"]').tooltip();
      }

      // Initialize dropdowns
      if (window.$ && window.$.fn.dropdown) {
        window.$('.dropdown-toggle').dropdown();
      }
    };

    // Wait for scripts to load then initialize
    setTimeout(initializeComponents, 1000);

    // Cleanup function
    return () => {
      // Remove any event listeners or cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default JavaScriptIntegration;
