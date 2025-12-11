// ==UserScript==
// @name         Reddit Reader (#Reddit)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.reddit.com/*
// @grant        none
// ==/UserScript==

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


        @media(min-width: 768px){
            .flex-grid--main-container-card.right-sidebar-xs {
            width: 100% !important;
            max-width: 100% !important;
            }
        }
        
        *[class*="display-none"] {
            display: none !important;
        }

        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {
    // all: "*",
    loginSider: "aside#right-rail-experience-root",
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

  /*  
───────────────────────────────────────────────────────────────
 ⚠️  !! DANGER SELECTOR — DO NOT USE  !!
───────────────────────────────────────────────────────────────

".flex-grid--main-container-card.right-sidebar-xs"

This selector looks innocent but on Reddit Mobile it wraps HUGE
chunks of the app, including article hydration roots.  

Removing it = TOTAL PAGE WIPEOUT 🧨  
(Black screen, no posts, no comments, no recovery.)

If you are reading this thinking  
"maybe it’s safe now…"  
NO. IT IS NOT. PUT THE KEYBOARD DOWN. 🖐️😂

This selector must stay UNUSED forever.
───────────────────────────────────────────────────────────────
*/

  const selectorMap = {
    sideBarContainer: "div#right-sidebar-container",
    subName: "div#pdp-credit-bar",
    header: "header",
    commentsAdd: "shreddit-comments-page-ad",
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

  // Open article
  let isArticleOpen = false;
  function expandArticle() {
    if (isArticleOpen) return;

    const btn = document.querySelector("button#t3_1pcd2ka-read-more-button");
    if (!btn) {
      console.log("[Read More] Expand button not found, retrying...");
      return;
    }

    console.log("[Read More] Expand button FOUND, clicking it.");
    btn.click();
    isArticleOpen = true;
  }

  // Replace user names with placeholder
  function anonymizeUsernames() {
    const usernameLinks = document.querySelectorAll(
      'a[href^="/user/"]:not(.rr-username-masked)'
    );

    usernameLinks.forEach((a) => {
      a.textContent = "──────────"; // <= your zen placeholder
      a.classList.add("rr-username-masked"); // prevents double work
    });
  }

  function removeViewInApp() {
    const appBanner = [...document.querySelectorAll("span")].find(
      (el) => el.textContent.trim() === "View in Reddit App"
    );

    if (appBanner) {
      appBanner.closest("div.relative")?.remove();
    }
  }

  // Initial run
  removeElements();
  testSelectors();
  expandArticle();
  anonymizeUsernames();
  removeViewInApp();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      testSelectors();
      removeElements();
      expandArticle();
      anonymizeUsernames();
      removeViewInApp();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
