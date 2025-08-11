// ==UserScript==
// @name         Ny-TimesCN (#NytCN)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://cn.nytimes.com/*
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

            body, 
            div[class*='article-paragraph'],
            figcaption span {
                font-size: 2rem !important;
                  font-family: "Noto Serif SC", serif;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
            }

            figcaption span {
                font-size: 1.4rem !important;
                color: grey !important;
            }

            body {
                padding: 0 1rem !important;
            }

            .test {
                border: 7px dashed red !important;
                background-color: rgba(97, 97, 97, 1) !important;
            }



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const selectorMap = {
    header: "header.title-bar",
    shareTools: "div[class*='share-tools-top-container']",
    suggestedNews: "div[class*='article-footer']",
    footer: "nav.nav-footer",
    downloadBanner: "div.download",
    articleDate: "div.byline",
    titleMeta: "div.article-header header small",
    imageCite: "figcaption cite",
  };

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
