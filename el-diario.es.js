// ==UserScript==
// @name         ElDiario.es (#ElDiario)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.eldiario.es/*
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
    header: ".header-container",
    preArticleExtras: ".row.row__header",
    shareButtons: "footer.rs-pill",
    authorsInfo: ".info-wrapper",
    twitterPosts: "figure.embed-container.embed-container--type-twitter",
    relatedArticles: "aside.know-more.know-more--with-image",
    upNextVideos:
      "figure.embed-container.embed-container--type-dailymotion.ratio",
    subscribeBox: "div#container-after-news-outlook",
    tags: ".tags",
    goHomeFloatingButton: "a.go-home__wrapper",
    extraArticles: ".recirculation-area",
    redundantSubtitle: "li.subtitle--hasAnchor",
    errorReportButton: "div#error-report",
    sponsoredContent: ".sponsored-content-wrapper",
    comments: "div#edi-comments",
    footer: ".row.row__footer",
    contentTag: "div.content-kicker",
    contentKicker: "p.image-kicker",
    summaryIntro: "ul.footer",
    // asideAds: "aside.news-sponsored-content",
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

  function safelyRemoveAds() {
    const adSelectors = [
      "div[class^='edi-advertising']",
      "div[class*=' edi-advertising']",
      "div.edi-advertising",
      "div.ad-mobile-intext",
      "div.ad-body",
      "div.ad__no-dotted",
      "div.ad__no-legend",
      "div.issticky",
      "div.isticky",
      "div[data-google-query-id]",
      "div[id^='google_ads']",
      "iframe[src*='doubleclick']",
      "iframe[src*='googlesyndication']",
      "iframe[id*='google_ads']",
      "div.second-col:has(aside.news-sponsored-content)",
    ];

    const safeSelectors = [
      ".news-header",
      ".news-header *",
      "h1.title",
      ".news-header h1",
      ".news-header h2",
      ".news-header ul",
      ".news-header li",
      ".news-header a",
    ];

    const isSafe = (el) => safeSelectors.some((sel) => el.matches(sel));

    for (const sel of adSelectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (isSafe(el)) {
          console.log("⛔ Skipping protected header element:", el);
          return;
        }

        console.log("🧹 Removing ad element:", el);
        el.remove();
      });
    }
  }

  // Initial run
  removeElements();
  testSelectors();
  safelyRemoveAds();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
      testSelectors();
      safelyRemoveAds();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

/* =========== TikTok remover ==============
/  ========================================*/
function removeTikTokIframes() {
  document.querySelectorAll("iframe").forEach((iframe) => {
    const src = iframe.src || "";

    if (src.includes("tiktok.com/embed")) {
      console.log("🔥 Removing TikTok embed:", src);

      // Try to remove a clean wrapper instead of leaving a hole
      let container = iframe;

      // climb up until we hit something meaningful
      while (
        container.parentElement &&
        container.parentElement !== document.body &&
        container.parentElement.childElementCount <= 3
      ) {
        container = container.parentElement;
      }

      container.remove();
    }
  });
}

removeTikTokIframes();

// Keep watching the DOM (TikTok embeds often load late)
new MutationObserver(removeTikTokIframes).observe(document.body, {
  childList: true,
  subtree: true,
});
