// ==UserScript==
// @name         Ars-Technica (#ArsTech)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://arstechnica.com/*
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

            body, * {
              background-color: rgb(255, 255, 255) !important;
            } 

            header h1 {
              color: rgb(0, 0, 0) !important;
            }

            .test {
                border: 7px dashed red !important;
            }



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorMap = {};

  const testSelectors = () => {
    Object.entries(testSelectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("test")) {
          el.classList.add("test");
          console.log(`Added test class: [${label}]`, el);
        }
      });
    });
  };

  const selectorMap = {
    authorBio: "div.author-mini-bio",
    mostRead: "div.single-most-read",
    commentsCounter: "div.story-tools",
    commentsContainer: "div.comments-container",
    header: "header#site-header",
    footer: "footer.site-footer",
    postNavigation: "div.post-navigation",
    imageCaption: "div.caption",
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

  // Initial run
  removeElements();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
