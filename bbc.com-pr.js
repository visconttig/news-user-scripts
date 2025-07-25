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

        `;
        document.head.appendChild(style);
    }

    injectCustomStyles();

    let podcastPromo = ".bbc-4quw3x.e1rfboeq7";
    let topStories = ".bbc-10pxgv6";
    let extraSelectors = [podcastPromo, topStories].join(", ");


    const removePlayer = () => {
        const player = document.querySelector(`${extraSelectors}`);
        if (player) {
            player.remove();
            console.log('x removed');
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

