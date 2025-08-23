// ==UserScript==
// @name         Universal Reader Style (Robust)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Apply shared reader styles to whitelisted sites
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // ==========================
  //  Whitelist with pure JS RegEx
  // ==========================
  const whitelistArray = [
    /arstechnica\.com/,
    /bbc\.com\/portuguese/,
    /bbc\.com/,
    /eldiario\.es/,
    /ilpost\.it/,
    /npr\.org/,
    /reddit\.com/,
    /phys\.org/,
    /quantamagazine\.org/,
    // /chinanews\.com/,
    // /cn\.nytimes\.com/,
  ];

  const url = location.href;

  function isWhiteListed() {
    return whitelistArray.some((rx) => rx.test(url));
  }

  if (!isWhiteListed()) {
    return; // Exit early if not whitelisted
  }

  function injectCustomStyles() {
    const style = document.createElement("style");
    style.textContent = /* css */ `


html {
  font-size: 10px !important;
}

            body, * {
                font-family: "Noto Serif", serif !important;
              background-color: rgb(255, 255, 255) !important;
            } 

            header h1, p {
              color: rgb(0, 0, 0) !important;
            }

    
 p {
  font-family: "Noto Serif", serif !important;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}

p {
    font-size: 2.4rem !important;
    color: black !important;
}

a.disabled-link {
    pointer-events: none !important;
    color: inherit !important;
    text-decoration: none !important;
    border-bottom: none !important;
 }

    `;
    document.head.appendChild(style);
  }

  const selectorMap = {
    generalLinks: "p a",
  };

  function removeElements() {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains("disabled-link")) {
          el.classList.add("disabled-link");
          console.log(`Disabled [${label}]`, el);
        }
      });
    });
  }

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      if (!isWhiteListed()) {
        return;
      }
      removeElements();
      injectCustomStyles();
    }, 100); // Slight delay to avoid React re-render collision
  });

  document.querySelectorAll("strong").forEach((strong) => {
    // Replace the <strong> with its inner content
    strong.replaceWith(...strong.childNodes);
  });

  injectCustomStyles();
  removeElements();
  observer.observe(document.body, { childList: true, subtree: true });
})();
