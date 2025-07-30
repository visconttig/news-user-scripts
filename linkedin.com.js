// ==UserScript==
// @name         Linkedin Feed Hider (#Linkedin)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  
// @match        https://www.linkedin.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Inject custom styles
    function injectCustomStyles() {
        const style = document.createElement('style');

        style.textContent = /* css */ `
            .hidden-xyz {
                visibility: hidden !important;
            }

            .unmounted {
                display: none !important;
            }

            .test {
                border: 7px dashed red !important;
                color: red !important;
            }

            img {
                blur(8px);
            }
        `;
        document.head.appendChild(style);
    }

    injectCustomStyles();
    

// Example text: People you may know from 𝗘𝗠𝗣𝗟𝗘𝗢 𝗜𝗧 𝗟𝗔𝗧𝗔𝗠💸🏡🕵️(ᴏꜰᴇʀᴛᴀꜱ ᴇxᴄʟᴜꜱɪᴠᴀꜱ ᴘᴀʀᴀ ᴘᴇʀꜰɪʟᴇꜱ ᴅᴇ ᴛᴇᴄɴᴏʟᴏɢÍᴀ - IT) 🧑‍💻

let currentCity = "Santiago";

const shouldHidePeopleBlock = (text) => {
    const lowered = text.toLowerCase();

    const isPeopleBlock = lowered.includes("you may know") || lowered.includes("to follow");

    const isPersonalizedByActivity = lowered.includes("activity");

    const isTargetingCurrentCity = new RegExp(`\\b${currentCity.toLowerCase()}\\b`).test(lowered);

    return isPeopleBlock && !isPersonalizedByActivity && !isTargetingCurrentCity;
};



const removeSuggestedPeople = () => {
    const headers = Array.from(document.querySelectorAll('h3')).filter(h3 => {
        const text = h3.textContent?.toLowerCase();
        return shouldHidePeopleBlock(text);
    });

    headers.forEach(h3 => {
        // Go up 2-3 levels from <h3> to reach the block container
        let container = h3.closest('section') || h3.closest('div[class]');
        if (container) {
            container.classList.add("unmounted"); 
            console.log("🙈 Block matched and marked:", container);
        } else {
            console.warn("⚠️ Couldn't find container for h3:", h3);
        }
    });
};




const selectorMap = {
    "feedPost" : ".feed-shared-update-v2__control-menu-container.display-flex.flex-column.flex-grow-1.full-height",
};

// Flatten to use in querySelectorAll
const selectors = Object.values(selectorMap).join(", ");


const hideElements = () => {
Object.entries(selectorMap).forEach(([label, selector]) => {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach(el => {
        if (!el.classList.contains('hidden-xyz')) {
            el.classList.add('hidden-xyz');
            console.log(`👻 Hidden [${label}]`, el);
        }
    });
});

}



    // Initial run
    hideElements();
    removeSuggestedPeople();

    // Observe DOM changes and hide again
    const observer = new MutationObserver(() => {
        setTimeout(() => {
            hideElements();
            removeSuggestedPeople();
        }, 100); // Slight delay to avoid React re-render collision
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
