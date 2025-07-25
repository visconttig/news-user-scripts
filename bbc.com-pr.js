// ==UserScript==
// @name         BBC Reader (#BBC Brazil)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  
// @match        https://www.bbc.com/portuguese/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Inject custom styles
    function injectCustomStyles() {
        const style = document.createElement('style');

        //inlineLinks: "a[class='focusIndicatorReducedWidth'][href]"
        style.textContent = /* css */ `
            .bbc-hidden {
                display: none !important;
            }
            
            a[class*='focusIndicatorReducedWidth'][href] {
                text-decoration: none;
                color: inherit;
                cursor: initial;
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
    }

    injectCustomStyles();


const selectorMap = {
    header: "header[role='banner']",
    articleInfo: "section[aria-labelledby='article-byline']",
    podcastPromo: "div[data-e2e='podcast-promo']",
    relatedSection: "section[data-e2e='recommendations-heading']",
    featuredContent: '[data-testid="features"]',
    mostRead: "section[aria-labelledby='recommendations-heading']",
    topStories: "div[data-testid='top-stories']",
    relatedTopics: "[aria-labelledby='related-topics']",
    relatedStories: "[aria-labelledby='related-content-heading']",
    endOfArticleMostRead: "[aria-labelledby='Most-Read']",
    footer: "footer"
};

// Flatten to use in querySelectorAll
const selectors = Object.values(selectorMap).join(", ");


const hideElements = () => {
Object.entries(selectorMap).forEach(([label, selector]) => {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach(el => {
        if (!el.classList.contains('bbc-hidden')) {
            el.classList.add('bbc-hidden');
            console.log(`👻 Hidden [${label}]`, el);
        }
    });
});

}

function disableTargetedLinks() {
    const links = document.querySelectorAll("a[class*='focusIndicatorReducedWidth'][href]");
    links.forEach(link => {
        // Avoid attaching multiple times
        if (!link.dataset.bbcLinkDisabled) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("🚫 Link disabled:", link.href);
            }, true); // Use capture phase to intercept early
            link.dataset.bbcLinkDisabled = "true";
        }
    });
}


    // Initial run
    hideElements();
    disableTargetedLinks();

    // Observe DOM changes and hide again
    const observer = new MutationObserver(() => {
        setTimeout(() => {
            hideElements();
            disableTargetedLinks();
        }, 100); // Slight delay to avoid React re-render collision
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
