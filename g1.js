// ==UserScript==
// @name         G1 (#G1)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://g1.globo.com/*
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

  const testSelectorsMap = {
    // all: "*",
    //>>>>> Avoid; too broad
    // baixeOApp: "div[data-block-type='raw']",
    //>>>>> Working ✅
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
    moreRead: "div[class*='mais-lidas__wrapper']",
    moreFromG1: "div[class~='feed']",
    nextArticle: "section[id='next-article']",
    audioPlayer: "div[data-block-type='multicontent-podcast']",
    seeAlsoVideos: "div[class*='shadow-video-flow']",
    suggestedVideos: "div[data-block-type='backstage-video']",
    commentsSection: "div[id='boxComentarios']",
    videos: "video",
    tags: "ul[data-track-action='tag semantica']",
    subtitle: "h2[itemprop='alternativeHeadline']",
    articleMeta: "div[class*='content__signa-share mc-column']",
    shareButtons: "div[class*='glb-share-bar content__share-bar']",
    summaryContainer: "div[class*='mc-summary-card__summary-container']",
    adsBlock: "div[class*='content-ads content-ads--reveal']",
    newsletterSection: "div[class*='mc-column newsletter-g1']",
    /*** To review; too general ***/
    suggestedArticlesAndAppDownload:
      "ul[data-mrf-recirculation*='Leia Também']",
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
