// ==UserScript==
// @name         NPR News (#npr-news)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the floating NPR player that interferes with reading
// @match        https://www.npr.org/*
// @grant        none
// ==/UserScript==

// ======================================================================
//  ⚠️ DO NOT REMOVE THIS OVERRIDE ⚠️
// ----------------------------------------------------------------------
// This site forces: html { font-size: 62.5%; }  →  1rem = 10px
// That completely breaks my universal rem-based typography
// and makes this site's text look ~40% smaller than all others.
//
// This override restores the normal root size (1rem = 16px) ONLY HERE.
// DO NOT delete it — it keeps this domain visually consistent
// without triggering the BBC “layout meltdown” problem.
//
// Seriously: this line is here *on purpose*.
// ======================================================================
/*
    html {
      font-size: 100% !important;
    }
*/

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


    html {
      font-size: 100% !important;
    }


                .story-layout .storytitle, .story-layout .story-meta, .story-layout .story #headlineaudio, .story-layout .storytext>p, .story-layout .storytext>.edTag, .story-layout .storytext>blockquote, .story-layout .storytext>.bucketwrap.list, .story-layout .supplementarycontent>.bucketwrap.list, .story-layout .breadcrumb, .story-layout .story>.slug-wrap, .story-layout .correction, .story-layout .date-block-affiliation-wrap, .story-layout .story>.tags, .story-layout .story>.social-wrap, .story-layout .story>.correction, .story-layout .hr, .story-layout .tmplMusicSongsStreamPlaylist .playlistwrap, .story-layout .bucketwrap.resaudio, .story-layout .share-tools--secondary, .story-layout .transcript .icn-story-transcript-wrap, .story-layout .story .callout, .story-layout .story .callout-end-of-story-mount-piano-wrap, .story-layout .org-promo, .story-layout .bucketwrap.twitter.large, .story-layout .storytext>.container.large, .story-layout .bucketwrap {
    max-width: 100% !important;
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
    player: "#npr-player",
    contentHeader: "div[class*='branding branding--custom']",
    interleavedSuggestions: "div.bucketwrap.internallink",
    donateButton: "li#navigation__station-donate-mount",
    storyMeta: "div#story-meta",
    inlinePlayer: "div#headlineaudio",
    tags: "div.tags",
    shareButtons: ".share-tools.share-tools--secondary",
    moreStoriesSection: "aside#end-of-story-recommendations-mount",
    endOfStorySupportBox: "div#callout-end-of-story-mount-piano-wrap",
    yetAnotherDonationsBox: "article.pn-ribbon",
    stickyDonationBar: "div#global-stickybar-mount-piano-wrap",
    giftBox: "body#ng-app",
    footer: "footer#npr-footer",
    header: "header#globalheader",
    slug: "div.slug-wrap",
    imageCredits: "span.credit",
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
