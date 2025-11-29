// ==UserScript==
// @name         Universal Reader Style (Robust)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Apply shared reader styles to whitelisted sites
// @match        *://*/*
// @grant        none
// ==/UserScript==

// ============================================================================
// ============================================================================
// === WARNING: NEVER — *EVER* — MESS WITH THE ROOT FONT-SIZE (html {font-size}) ===
// ============================================================================
// ============================================================================
//
// Changing the root font-size (html { font-size }) may *seem* like a simple
// universal typography fix, BUT IT IS A NUCLEAR OPTION THAT BREAKS EVERYTHING.
//
// WHY YOU MUST NEVER TOUCH IT:
//
// 1) BREAKS BBC NEWS COMPLETELY
//    - BBC uses "rem"-based grid breakpoints.
//    - When you set html { font-size: 10px !important }, all their media queries
//      shift unpredictably.
//    - This SHRINKS THE MAIN ARTICLE TO 1/3 OF THE SCREEN and destroys layout.
//    - It took you HOURS to figure this out. Don’t repeat the pain.
//
// 2) BREAKS ANY SITE USING REM FOR LAYOUT OR GRID
//    - Columns collapse.
//    - Containers become narrow or gigantic.
//    - Entire sections fall out of alignment.
//    - Systems relying on “1rem = 16px” logic stop working.
//
// 3) BREAKS RESPONSIVE BEHAVIOR
//    - rem-based breakpoints get triggered at the wrong times.
//    - Desktop layouts act like mobile, or vice-versa.
//
// 4) BREAKS JS THAT READS COMPUTED FONT SIZES
//    - Many sites use JS to detect the computed root size.
//    - When you override it, you cause miscalculations everywhere.
//
// 5) YOU DON’T NEED IT ANYWAY
//    - Your scripts directly assign font sizes to paragraphs, headings, captions,
//      etc. with !important.
//    - You already have total control over typography WITHOUT touching the root.
//    - Removing the root override has **zero downside**.
//
// TL;DR:
// ======
// ***You control all the text you care about directly.***
// ***Root overrides destroy layouts and offer no benefit.***
// ***BBC News is the proof — it instantly collapses if you touch html{font-size}.***
//
// LEAVE THE ROOT ALONE.
// FUTURE YOU WILL THANK YOU.
//
// ============================================================================

(function () {
  "use strict";

  // ==========================
  //  Whitelist with pure JS RegEx
  // ==========================
  const whitelistArray = [
    /arstechnica\.com/,
    /bbc\.com\/portuguese/,
    /bbc\.com\/news\//,
    /eldiario\.es/,
    /ilpost\.it/,
    /npr\.org/,
    /reddit\.com/,
    /phys\.org/,
    /quantamagazine\.org/,
    /chinanews\.com/,
    /cn\.nytimes\.com/,
  ];

  const url = location.href;

  function isWhiteListed() {
    return whitelistArray.some((rx) => rx.test(url));
  }

  if (!isWhiteListed()) {
    return; // Exit early if not whitelisted
  }

  function injectGoogleFonts() {
    if (document.getElementById("tm-google-fonts")) return; // avoid duplicates
    const link = document.createElement("link");
    link.id = "tm-google-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap";
    document.head.appendChild(link);
  }

  // Call this early in your script
  injectGoogleFonts();

  function injectCustomStyles() {
    const style = document.createElement("style");
    style.textContent = /* css */ `


body {
  padding: 0 32px !important;
}

/* Force readable colors but let OS mode decide */
@media (prefers-color-scheme: light) {
  body, * {
    background-color: #fff !important;
    color: #000 !important;
  }
}

@media (prefers-color-scheme: dark) {
  body, * {
    background-color: #000 !important;
    color: #fff !important;
  }
}


body, p, li, blockquote, article, section, h1, h2, h3, h4, h5, h6 {
  font-family: "Noto Serif", serif !important;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
  // line-height: 1.7 !important;
  line-height: 1.3 !important;
}


h1, h2, h3, h4, h5, h6 {
  line-height: 1.25 !important;
}
    

 p {
  //  font-size: 1.8rem !important;
      font-size: 1.2rem !important;
}

h1 {
  // font-size: 2.2rem !important;
     font-size: 2rem !important;
}

h2 {
  // font-size: 2rem !important;
    font-size: 1.6rem !important;
}

p[class*='caption'], 
div[class*='caption'] p, 
figcaption, figcaption * {
  color: gray !important;
  // font-size: 1.2rem !important;
  font-size: 0.8rem !important;
  line-height: 1.2 !important;
}



a.disabled-link, p a u {
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
