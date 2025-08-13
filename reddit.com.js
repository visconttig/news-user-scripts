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


        .test {
            border: 7px dashed red;
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

  document.querySelectorAll("strong").forEach((strong) => {
    // Replace the <strong> with its inner content
    strong.replaceWith(...strong.childNodes);
  });

  const selectorMap = {
    sideBarContainer: "div#right-sidebar-container",
  };

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

  const hideElements = () => {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("display-none")) {
          el.classList.add("display-none");
          console.log(`👻 Hidden [${label}]`, el);
        }
      });
    });
  };

  // Testing Elements
  let mainArticle = ".flex-grid--main-container-card.right-sidebar-xs";

  let elementesArr = [].toString();

  const testSelectors = () => {
    let els = document.querySelectorAll(elementesArr);

    els.forEach((e) => {
      e.classList.add("test");
    });
  };

  // Initial run
  hideElements();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      hideElements();
      testSelectors();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
