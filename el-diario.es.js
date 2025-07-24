
// ==UserScript==
// @name         ElDiario.es - Reader mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the floating NPR player that interferes with reading
// @match        https://www.eldiario.es/*
// @grant        none
// ==/UserScript==



(function() {
    'use strict';

    // Inject CSS once
    function injectCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `

        `;
        document.head.appendChild(style);
    }

    injectCustomStyles();


    let header = ".header-container";
    let pre_article_extras = ".row.row__header";
    let share_buttons = "footer.rs-pill";
    let authors_info = ".info-wrapper";
    let twitter_posts = "figure.embed-container.embed-container--type-twitter";
    let related_articles = "aside.know-more.know-more--with-image";
    // let up_next_videos = "figure.embed-container.embed-container--type-dailymotion.ratio"; <=== don't!!! this one hide the videos
    let tags = ".tags";
    let goHomeFloatingButton = "a.go-home__wrapper";
    let extraArticles = ".recirculation-area";
    let redundant_subtitle = "li.subtitle--hasAnchor";
    let errorReportButton = "div#error-report";
    let sponsoredContent = ".sponsored-content-wrapper";
    let comments = "div#edi-comments";
    let footer = ".row.row__footer";
    let extraSelectors = [header, pre_article_extras, share_buttons, authors_info, twitter_posts, related_articles, tags, goHomeFloatingButton, extraArticles, redundant_subtitle, errorReportButton, sponsoredContent, comments, footer].join(", ");


    const removeElements = () => {
        const elements = document.querySelector(`${extraSelectors}`);
        if (elements) {
            elements.remove();
            console.log('x removed');
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


(function() {
    'use strict';

    function removePaywallModal() {
        // 1. Remove the modal
        const modal = document.querySelector('.tp-modal');
        if (modal) {
            modal.remove();
            console.log('🧼 Removed Piano paywall modal');
        }

        // 2. Restore scrolling
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // 3. Remove any backdrop/overlay if present
        const overlay = document.querySelector('.tp-backdrop, .tp-modal-backdrop, .tp-veil'); // guesswork
        if (overlay) {
            overlay.remove();
            console.log('💨 Removed modal overlay');
        }
    }

    // Run once immediately
    removePaywallModal();

    // Run continuously to fight reinjection
    const observer = new MutationObserver(() => removePaywallModal());
    observer.observe(document.body, { childList: true, subtree: true });
})();

