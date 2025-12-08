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
    // embeddedInstagram1:
    //   "div[id='embed-video-container']:has(div[data-testid='embed-video'])",
    // embeddedInstagram2: "iframe[name='__tt_embed__v71851727139883500']",
    // embeddedInstagram3: "main[data-e2e='src-theme-template-Main']",
    // embeddedInstagram4: "div[data-e2e='video-v2-home-ContainerWrapper']",
    // embeddedInstagram5: "div[data-testid='embed-video']",
    // embeddedRecommendation: "div[data-testid='embed-recommendation']",
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
      if (window.__probeEmbeds) window.__probeEmbeds({ autoRemove: false });
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

(function () {
  "use strict";

  function removePaywallModal() {
    // 1. Remove the modal
    const modal = document.querySelector(".tp-modal");
    if (modal) {
      modal.remove();
      console.log("🧼 Removed Piano paywall modal");
    }

    // 2. Restore scrolling
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    // 3. Remove any backdrop/overlay if present
    const overlay = document.querySelector(
      ".tp-backdrop, .tp-modal-backdrop, .tp-veil"
    ); // guesswork
    if (overlay) {
      overlay.remove();
      console.log("💨 Removed modal overlay");
    }
  }

  // Run once immediately
  removePaywallModal();

  // Run continuously to fight reinjection
  const observer = new MutationObserver(() => removePaywallModal());
  observer.observe(document.body, { childList: true, subtree: true });
})();
