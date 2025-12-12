// ==UserScript==
// @name         --- (#---)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.biobiochile.cl/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Inject custom styles
  function injectCustomStyles() {
    const style = document.createElement("style");

    style.textContent = /* css */ `
            
            .hidden-xyz {
                visibility: hidden !important;
            }

            .unmounted {
                display: none !important;
            }


            .test {
                border: 7px dashed red !important;
            }

            main[class*='background-fade'] {
              background: unset !important;
            }


            /* paddings */
            #post > div > main > .container.main-top-container,
            #post > div > main > .container.main-top-container > div {
              max-width: none !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              box-sizing: border-box !important;
             // border: 3px dotted yellow !important; /* for debugging */
            }

            /* This version will override all .post-main 
            no matter where it lives — as long as it is 
            inside the reader wrapper. */
            :where(.reader-container) .post-main {
              max-width: none !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            /* article image */
            #post [class*="post-image"] img {
                width: 100% !important;
                height: auto !important;
            }

            #post .post .post-image {
                position: static !important;
            }

            /* auto-highlighting feature */
            /* Kill highlight animations and styling */
            :where(.reader-container) .destacador,
            :where(.reader-container) .destacador.destacado {
              background: none !important;
              background-image: none !important;
              background-size: auto !important;
              background-position: 0 !important;
              transition: none !important;
              padding: 0 !important; /* optional, removes extra gap */
            }


        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {
    // all: "*",
  };

  // Flatten to use in querySelectorAll
  const tSelectors = Object.values(testSelectorsMap).join(", ");

  const testSelectors = () => {
    Object.entries(testSelectorsMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("test")) {
          el.classList.add("test");
          console.log(`Added test class [${label}]`, el);
        }
      });
    });
  };

  const selectorMap = {
    header: "header",
    headerSticky: "div.header-little-navbar",
    liveTv: "#container-live-bbtv",
    liveTVSticky: "div#live-bbtv",
    accesibilityButton: "div[class*='boton-accesible']",
    category: "div.categoria",
    category2: "h2.post-category",
    imageCredits: "div.post-image-credits",
    floatingElements: "div.float-container",
    authors: "div.autores-trust-project",
    dataVisits: "div.fecha-visitas",
    trustProject: "div[class*='autor-cbbleermastarde']",
    trustProject2: "div#cbb-aux-container",
    summaryButton: "div#resumen-ia",
    inArticleSuggestions: "div.lee-tambien-bbcl",
    errorsButtons: "div.contenedor-correcciones",
    followButtons: "div.botones-google-news-wsp",
    commentsButton: "div#appComponentComunidad",
    newsLetterBanner: "div:has(> a > img#newsletter-investiga-escritorio)",
    footer: "footer",
    aside: "aside",
    socialButtons: "div.post-social-container",
    suggestions: "section[class*='section-realtime']",
    visitsCounter: "div.post-image-credits-visits-container",
    date: "div.post-date",
    partners: "iframe",
    otherAuthors: "p.autores-extra-trust-project",
    audioPlayer: "audio",
    quotations: "blockquote.twitter-tweet",
    instagram: "blockquote.instagram-media",
  };

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

  const removeElements = () => {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("unmounted")) {
          el.classList.add("unmounted");
          console.log(`👻 Hidden [${label}]`, el);
        }
      });
    });
  };

  const disableInfinitScroll = () => {
    document.querySelectorAll(".infinite-loading-container").forEach((el) => {
      const vm = el.__vue__;
      if (vm && vm.status !== 2) {
        vm.status = 2;
        vm.$destroy?.();
        el.remove();
      }
    });
  };

  // Initial run
  removeElements();
  testSelectors();
  disableInfinitScroll();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
      testSelectors();
      disableInfinitScroll();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
