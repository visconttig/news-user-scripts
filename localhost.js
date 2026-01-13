// ==UserScript==
// @name         Localhost (#lclh)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        http://localhost*
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


              a[href] {
                text-decoration: none;
                color: inherit;
                cursor: initial;
                border-bottom: none;
            }


            /* Force readable colors but let OS mode decide */
            @media (prefers-color-scheme: light) {
            body, * {
                background-color: #fff !important;
                color: #000 !important;
            }
            }

            @media (prefers-color-scheme: dark) {
            body, * {
                background-color: #000 !important;
                color: #fff !important;
            }
            }

            body {
            padding: 0 32px !important;
            }

            body, 
            div p,
            figcaption span {
                font-size: 1.6rem !important;
                font-family: "Noto Serif SC", serif !important;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
            }

            figcaption span {
                font-size: 1rem !important;
                color: grey !important;
            }

            h1 {
              font-size: 2.6rem;
              margin-bottom: 1rem;
            }

            p {
              margin-bottom: 0.6rem;
            }

            section {
              margin-bottom: 3rem;
            }

            img {
              margin: 2rem 0;
            }



            body, p, li, blockquote, article, section, h1, h2, h3, h4, h5, h6 {
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
            font-variation-settings:
                "wdth" 100;
            line-height: 1.3 !important;
            }


            h1, h2, h3, h4, h5, h6 {
            line-height: 1.25 !important;
            }

            a.disabled-link, p a u {
                pointer-events: none !important;
                color: inherit !important;
                text-decoration: none !important;
                border-bottom: none !important;
            }

            img {
              max-width: 100%;
              height: auto;
            }

            img {
                width: 100% !important;
                height: auto !important;
            }


            .test {
                border: 7px dashed red !important;
                background-color: rgba(97, 97, 97, 1) !important;
            }



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const selectorMap = {};

  const testSelectorMap = {};

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

  const testSelectors = () => {
    Object.entries(testSelectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("test")) {
          el.classList.add("test");
          console.log(`Added test class: [${label}]`, el);
        }
      });
    });
  };

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

  function injectGoogleFont() {
    // Preconnect to fonts.googleapis.com
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    // Preconnect to fonts.gstatic.com with crossorigin
    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "";
    document.head.appendChild(preconnect2);

    // Actual font stylesheet
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap";
    document.head.appendChild(fontLink);
  }

  // Initial run
  removeElements();
  testSelectors();
  injectGoogleFont();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
      testSelectors();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
