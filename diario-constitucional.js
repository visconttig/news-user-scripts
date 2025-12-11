// ==UserScript==
// @name         Diario Constitucional (#D-Const.)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.diarioconstitucional.cl/*
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
                background-color: yellow !important;
                background: yellow !important;
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
    header: "div#tdi_14",
    stickyHeader: "div#tdi_22",
    category: "div[class*='tdb-category']",
    preTitle: "div.dc-antetitulo",
    footer: "div.td-footer-wrap",
    scrollButton: "div[class*='td-scroll-up']",
    inArticleRelateds: "div[class*='relacionados']",
    suggestions0: "div[class*='td-cpt-post']",
    suggestions: "div#tdi_79",
    suggestions2: "div.td-module-container",
    sectionTitle: "p.tdm-descr",
    respond: "div#comments",
    imageAlt: "figcaption",
    topic: "a.tdb-entry-crumb",
    background: "div.td-menu-background",
    tags: "ul.tdb-tags",
    sider: "[class*='tdi_82']",
    borderBlocks:
      "[class*='td-pb-border-top'][class*='tdi_']:not([class*='tdi_49']):not([class*='tdi_64']):not([class*='tdi_56']):not([class*='tdi_50'])",
    borders2: "div[class*='vc_row_inner']",
    anotherBorder: "div#tdi_3",
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

  // Initial run
  removeElements();
  testSelectors();

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
