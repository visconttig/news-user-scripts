// ==UserScript==
// @name         CCTV News (#CCTV)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://news.cctv.com/*
// @grant        none
// ==/UserScript==

https: (function () {
  "use strict";

  // Inject custom styles
  function injectCustomStyles() {
    const style = document.createElement("style");

    style.textContent = /* css */ `
            
            // html {
            //     font-size: 16px !important;
            //     color: red !important;
            // }
            
            .hidden-xyz {
                visibility: hidden !important;
            }

            .unmounted {
                display: none !important;
            }


            .test {
                border: 7px dashed red !important;
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

            // body {
            // padding: 0 32px !important;
            // }

            // body, 
            // div p,
            // figcaption span {
            //     font-size: 1.6rem !important;
            //     font-family: "Noto Serif SC", serif !important;
            //     font-optical-sizing: auto;
            //     font-weight: 500;
            //     font-style: normal;
            // }


            // body, p, li, blockquote, article, section, h1, h2, h3, h4, h5, h6 {
            // font-optical-sizing: auto;
            // font-weight: 400;
            // font-style: normal;
            // font-variation-settings:
            //     "wdth" 100;
            // line-height: 1.3 !important;
            // }


            // h1, h2, h3, h4, h5, h6 {
            // line-height: 1.25 !important;
            // }

            // a.disabled-link, p a u {
            //     pointer-events: none !important;
            //     color: inherit !important;
            //     text-decoration: none !important;
            //     border-bottom: none !important;
            // }




        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {
    // all: "*",
    bottomInfo: "div.bottom_ind01",
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
    header: "div[class*='head']",
    suggestedArticles: "div.XUQIU18897_tonglan",
    floatingButton: "div#back_to_clue",
    searchBar: "div.search",
    footer: "footer",
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
