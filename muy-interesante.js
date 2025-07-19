// ==UserScript==
// @name         Muy-Interesante Magazine
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes header and others that interferes with reading
// @match        https://www.muyinteresante.com/*
// @grant        none
// ==/UserScript==



(function() {
    'use strict';

    // Inject CSS once
    function injectCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `

        b, strong {
            font-weight: normal;
        }

        `;
        document.head.appendChild(style);
    }

    injectCustomStyles();

    let readingPosition = "progress.reading-position";
    let titleHeader = "header.header.js-header";
    let breadCrumbList = "nav.breadcrumbs-list";
    let categoriesTags = "a.categories__category";
    let shareButtons = "nav.article-share";
    let authorInfo = ".article-meta__content";
    let video = ".video.jw-video";
    let relatedArticles = "aside.post-card.post-card--has-variant-lg-horizontal.has-aspect-ratio-16-9.has-link.wp-block-zinet-platform-card.has-background.has-neutrals-200-background-color";
    let references = ".wp-block-group.box-references.has-border-color.has-background.is-layout-constrained.wp-container-core-group-is-layout-1.wp-block-group-is-layout-constrained";
    let newsCollections = ".news-collection.news-collection--has-lg-font-size.news-collection--is-default.article__tags";
    let otherArticles = "article.post-card.post-card--has-variant-lg-stacked.has-aspect-ratio-16-9";
    let otherArticlesTitle = ".section-header.has-separator.section-header--has-variant-lg";
    let footer = "footer.footer";

    let extraSelectors = [readingPosition, titleHeader, breadCrumbList, categoriesTags, shareButtons, authorInfo, video, relatedArticles, references, newsCollections, otherArticles, otherArticlesTitle, footer].join(", ");


    const removeElements = () => {
        const toRemove = document.querySelector(`${extraSelectors}`);
        if (toRemove) {
            toRemove.remove();
            console.log('X removed');
        }
    };

    // Initial attempt
    removeElements();

    // Observer to catch dynamically injected players
    const observer = new MutationObserver(() => removeElements());

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();


