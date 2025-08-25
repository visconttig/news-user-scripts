// ==UserScript==
// @name         QuantaMagazine (#Quanta)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.quantamagazine.org/*
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

            div[class*='flex-auto mha container--xs'] {
              max-width: 100% !important;
            }


            .test {
                border: 7px dashed red !important;
            }



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {};

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
    header: "div[class*='nav__container']",
    postTitle: "div[class*='post__title__kicker']",
    postTitleActions: "div[class*='post__title__actions'",
    imageAttribution: "div[class*='attribution']",
    followAlongHeader: "section[class*='outer header__inner']",
    followAlong2: "div[class*='nav__local fill-v z1 absolute fit-x']",
    relatedArticles: "div.related-list",
    footer1: "div.post__footer",
    newsletterBox: "section[class*='outer newsletter']",
    moreRelatedArticles:
      "section[class*='outer post__category pv2 outer--content']",
    commentSection:
      "section[class*='outer comments relative fill-h bg-gray1 pt2 outer--content']",
    nextPost: "div[class*='next-post']",
    footer: "section[class*='outer footer__outer']",
    progressBar: "div[class*='nav__local__progress']",
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
