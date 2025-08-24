// ==UserScript==
// @name         Hide NPR Live Player (#npr-player)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the floating NPR player that interferes with reading
// @match        https://www.npr.org/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Inject CSS once
  function injectCustomStyles() {
    const style = document.createElement("style");
    style.textContent = /* css */ `

            .storytitle h1, .childstory .storytitle h2, h2.contentsubtitle {
                //color: black !important;
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
