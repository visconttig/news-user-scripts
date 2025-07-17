// ==UserScript==
// @name         Hide NPR Live Player (#npr-player)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the floating NPR player that interferes with reading
// @match        https://www.npr.org/*
// @grant        none
// ==/UserScript==



// set left-margin to paragraphs: p { lef-margin: 24px !important; }

(function() {
    'use strict';

    let donationsBox = "body#ng-app";
    let donateButton = "li#navigation__station-donate-mount";
    let tags = "div.tags";
    let shareButtons = ".share-tools.share-tools--secondary";
    let moreStoriesSection = "aside#end-of-story-recommendations-mount";
    let endOfStorySupportBox = "div#callout-end-of-story-mount-piano-wrap"
    let footer = "footer#npr-footer";

    let extraSelectors = [donationsBox, donateButton, tags, shareButtons, moreStoriesSection, endOfStorySupportBox, footer].join(", ");


    const removePlayer = () => {
        const player = document.querySelector(`#npr-player, .npr-player, .bucketwrap, body#ng-app, ${extraSelectors}`);
        if (player) {
            player.remove();
            console.log('🎧 NPR player removed');
        }
    };

    // Initial attempt
    removePlayer();

    // Observer to catch dynamically injected players
    const observer = new MutationObserver(() => removePlayer());

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
