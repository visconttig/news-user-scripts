// ==UserScript==
// @name         Script tester
// @namespace    http://tampermonkey.net/
// @description  blahblah
// @match        *://*/*
// @version      0.1

console.log("🛠️ Test script loaded");

(function () {
  "use strict";

  // Inject custom styles
  function injectCustomStyles() {
    const style = document.createElement("style");

    //inlineLinks: "a[class='focusIndicatorReducedWidth'][href]"
    style.textContent = /* css */ `
            .test {
                border: 7px dashed red !important;
                color: red !important;
            }
        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const selectorMap = {
    allElements: "div",
  };

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

  const hideElements = () => {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("test")) {
          el.classList.add("test");
          console.log(`Added test class: [${label}]`, el);
        }
      });
    });
  };

  // Initial run
  hideElements();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      hideElements();
      injectCustomStyles();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
