// ==UserScript==
// @name         Khan Academy (#Khan)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.khanacademy.org/*
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

            // Navigation
            div._1wvnfq44 {
                // width: 405px;
                width: 200px !important;
                border: 3px solid blue !important;
            }
            

            // Control bar
            div[data-testid='content-library-footer'] {
                height: 25px !important;
                border: 3px dashed red !important;
            }



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {
    // all: "*",
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

  /* Removing the side nav breaks the entire site ⚠️ */
  // sideNav: "div._m726ao3:has(nav[data-testid='side-nav'])",
  const selectorMap = {
    header: "div#top-header-container",
    userInfo: "div[class*='user-info-container large-header']",
    topicIcon: "h2._73zaqew",
    footer: "footer",
    motivationalBanner: "section[class*='stp-animated-banner']",
    googleLinks: "div._q767c9",
    resumeLearning: "div._19v9zas7",
    relatedVideos: "div._uhlm2",
    videoTabs: "div._29pqx4v:has(div#videoPageTabs)",
    forum: "div._1sxr4kbk",
    videoTranscript: "div:has(> div._q86lnx)",
    drawButton: "div._168y59oy",
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

  // Close side nav bar
  let navClosed = false;
  function closeNavBar() {
    if (navClosed) return;

    const btn = document.querySelector("button[data-testid='sidebar-close']");
    if (!btn) {
      console.log("[nav] Close button not found, retrying...");
      return;
    }

    console.log("[nav] Close button FOUND, clicking it.");
    btn.click();
    navClosed = true;
  }

  // Initial run
  removeElements();
  testSelectors();
  closeNavBar();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
      testSelectors();
      closeNavBar();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
