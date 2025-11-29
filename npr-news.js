// ==UserScript==
// @name         Hide NPR Live Player (#npr-player)
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

  // Inject CSS once
  function injectCustomStyles() {
    const style = document.createElement("style");
    style.textContent = /* css */ `


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

  let player = "#npr-player";
  let interleavedSuggestions = "div.bucketwrap.internallink";

  // let donationsBox = "body#ng-app"; <=== removes images
  let donateButton = "li#navigation__station-donate-mount";
  let storyMeta = "div#story-meta";
  let inlinePlayer = "div#headlineaudio";
  let tags = "div.tags";
  let shareButtons = ".share-tools.share-tools--secondary";
  let moreStoriesSection = "aside#end-of-story-recommendations-mount";
  let endOfStorySupportBox = "div#callout-end-of-story-mount-piano-wrap";
  let yetAnotherDonationsBox = "article.pn-ribbon";
  let stickyDonationBar = "div#global-stickybar-mount-piano-wrap";
  let giftBox = "body#ng-app";
  let footer = "footer#npr-footer";
  let header = "header#globalheader";
  let slug = "div.slug-wrap";
  let imageCredits = "span.credit";

  let extraSelectors = [
    interleavedSuggestions,
    player,
    donateButton,
    storyMeta,
    inlinePlayer,
    tags,
    shareButtons,
    moreStoriesSection,
    endOfStorySupportBox,
    yetAnotherDonationsBox,
    stickyDonationBar,
    giftBox,
    footer,
    yetAnotherDonationsBox,
    header,
    slug,
    imageCredits,
  ].join(", ");

  const removePlayer = () => {
    const player = document.querySelector(`${extraSelectors}`);
    if (player) {
      player.remove();
      console.log("🎧 NPR player removed");
    }
  };

  // Initial attempt
  removePlayer();

  // Observer to catch dynamically injected players
  const observer = new MutationObserver(() => removePlayer());

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
