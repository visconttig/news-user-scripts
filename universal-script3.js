// ==UserScript==
// @name         Universal Reader Style (CSP-safe & Robust)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Apply shared reader styles to whitelisted sites
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // ==========================
  // 1) Whitelist with JS RegEx
  // ==========================
  const whitelist = [
    /arstechnica\.com/,
    /bbc\.com\/portuguese/,
    /bbc\.com/,
    /eldiario\.es/,
    /ilpost\.it/,
    /npr\.org/,
    /reddit\.com/,
    /phys\.org/,
    /quantamagazine\.org/,
    /chinanews\.com/,
    /cn\.nytimes\.com/,
  ];

  if (!whitelist.some((rx) => rx.test(location.href))) return;

  // ==========================
  // 2) Inject shared styles
  // ==========================
  function injectCustomStyles() {
    if (document.getElementById("universal-reader-style")) return;
    const style = document.createElement("style");
    style.id = "universal-reader-style";
    style.textContent = /* css */ `

    html {
        font-size: 10px;
    }


      p {
        font-family: "Noto Serif", serif !important;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
        font-size: 2rem !important;
        color: gray !important;
      }

      a.disabled-link {
        pointer-events: none !important;
        color: inherit !important;
        text-decoration: none !important;
        border: 2px dashed red !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================
  // 3) Disable links safely
  // ==========================
  const selectorMap = {
    generalLinks: "p a",
  };

  function disableLinks() {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.dataset.disabledLink) {
          el.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`🚫 Disabled [${label}] link`, el.href);
            },
            true // capture phase
          );
          el.dataset.disabledLink = "true";
          el.classList.add("disabled-link");
        }
      });
    });
  }

  // ==========================
  // 4) Unwrap <strong> elements
  // ==========================
  function unwrapStrong() {
    document.querySelectorAll("strong").forEach((strong) => {
      strong.replaceWith(...strong.childNodes);
    });
  }

  // ==========================
  // 5) Initialize
  // ==========================
  function init() {
    injectCustomStyles();
    unwrapStrong();
    disableLinks();

    // Observe dynamic content
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        injectCustomStyles();
        unwrapStrong();
        disableLinks();
      }, 100); // small delay for React/Vue hydration
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Run after page load
  if (document.readyState === "loading") {
    window.addEventListener("load", init);
  } else {
    init();
  }
})();
