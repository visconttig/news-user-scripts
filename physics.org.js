// ==UserScript==
// @name         Physics.org (#Phys.org)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://phys.org/*
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
    header: "header.header",
    date: "article.news-article div.row",
    articleActions: "div:has(> ul.article-actions)",
    author: "p.article-byline",
    breadCrumbs: "div.col-9.col-md-9.col-xl-10",
    socialMenu: "div[class*='col-2 mt-md-5 d-print-none']",
    subscribeBox: "div[class*='ads']",
    donationsBox: "div.article-main__support",
    endOfArticleTrademark: "p[class*='article-main__note']",
    relatedArticle: "div[class*='article-main__explore']",
    socialInteractionsRibbon: "div[class*='article-interaction']",
    relatedNews: "section[class*='news-related']",
    hr: "hr",
    moreRelatedNews: "div#news-more",
    footer: "footer[class*='footer']",
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
