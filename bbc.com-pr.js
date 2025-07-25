// ==UserScript==
// @name         BBC Reader (#BBC Brazil)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  
// @match        https://www.bbc.com/portuguese/*
// @grant        none
// ==/UserScript==



(function() {
    'use strict';

    // Inject CSS once
    function injectCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .bbc-hidden {
            display: none !important;
        }
        `;
        document.head.appendChild(style);
    }

    injectCustomStyles();

    let articleInfo = "section[aria-labelledby='article-byline']"; // <=== This is the only one working !!
    let podcastPromo = 'div[data-e2e="podcast-promo"]';
    let readMore1 = "section[data-e2e='recommendations-heading']";
    let readMore = '[data-testid="features"]';
    let mostRead = "section[aria-labelledby='recommendations-heading']";
    let topStories = 'div[data-testid="top-stories"]';


    let extraSelectors = [articleInfo, podcastPromo, readMore1, readMore, mostRead, topStories].join(", ");


// Hide elements instead of hidding it to avoid conflicts with React Virtual DOM
const removePlayer = () => {
    const player = document.querySelector(`${extraSelectors}`);
    if (player && !player.classList.contains('bbc-hidden')) {
        player.classList.add('bbc-hidden');
        console.log('🎧 Podcast promo visually hidden');
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

