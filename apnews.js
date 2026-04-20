// ==UserScript==
// @name         APNews (#AP)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://apnews.com/*
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



    @media only screen and (min-width: 1024px) {
    .Page-twoColumn {
        display: block !important;
    }
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
    script: "script",
    header: "div.Page-header-stickyWrap",
    introTag: "div.Page-breadcrumbs",
    metaInfo: "div.StoryPage-actions-wrapper",
    asideMostRead: "aside",
    articleAds: "div.fs-feed-ad",
    related: "*[data-parsely-title='Related Stories']",
    authorInfo: "div.Page-authorInfo",
    footer: "footer",
    accessBtn: "div[id='usntA40Toggle']",
    accessBtn2: "div[id='usntA40Toggle']",
    accessBtn3: "a[id='usntA40Link']",
    hiddenAd: "div.LeaderBoardAd-Web",
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
