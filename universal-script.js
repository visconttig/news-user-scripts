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
    /diarioconstitucional\.cl/,
    /voachinese\.com/,
    /biobiochile\.cl/,
    /scotusblog\.com/,
  ];

  // ==========================
  // Blacklist (sites to EXCLUDE from universal styling)
  // ==========================
  const blacklistArray = [/inoreader\.com/, /rlevel\.visconttig\.com/];

  const url = location.href;

  function isWhiteListed() {
    return whitelistArray.some((rx) => rx.test(url));
  }

  function isBlackListed() {
    return blacklistArray.some((rgx) => rgx.test(url));
  }

  if (!isWhiteListed() || isBlackListed()) {
    console.log("Universal Reader SKIPPED for:", url);
    return;
  }

  // EVERYTHING BELOW THIS LINE is protected:
  // no styles, no observers, no DOM changes before whitelist is confirmed.

  console.log("[Reader] main() start.");

  // 1) Create wrapper early, once
  const wrapper = wrapReaderContent();
  console.log("[Reader] wrapper result:", wrapper);

  // 2) Only *after* wrapper is safely placed,
  //    start watching for dynamic changes you care about

  console.log("[Reader] main() end.");
  console.log("Universal Reader ACTIVE for:", url);

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

          /* Comfortable padding without gutters on mobile */
          .reader-container {
            margin: 0 auto;
            padding: 0 2rem !important; /* safe, comfy, never breaks mobile */
            box-sizing: border-box;
          }

        /* Prevent collapsed margins: 
        0.01px padding stops <p> margins 
        from disappearing — do not remove */
          .reader-container {
            padding-top: 0.01px !important;
            padding-bottom: 0.01px !important;
          }


          :where(.reader-container) p {
          margin: 0 !important;
          margin-block: 0 !important;
          margin-inline: 0 !important;
          margin-block-start: 0 !important;
          margin-block-end: 0 !important;
          margin-inline-start: 0 !important;
          margin-inline-end: 0 !important;

          /* and now *set* what you want */
          margin-bottom: 0.4rem !important;
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


          /* === Universal Typography Override (Unbeatable Version) === */
          /* Core typography and line-height */
          :where(.reader-container) :where(
            body, p, li, blockquote, article, section, h1, h2, h3, h4, h5, h6
          ) {
            font-family: "Noto Serif", serif !important;
            font-optical-sizing: auto !important;
            font-weight: 400 !important;
            font-style: normal !important;
            font-variation-settings: "wdth" 100 !important;
            line-height: 1.3 !important;
          }

          /* Headings: line-height refinement */
          :where(.reader-container) :where(h1, h2, h3, h4, h5, h6) {
            line-height: 1.25 !important;
          }

          /* Paragraph size */
          :where(.reader-container) p {
            font-size: 1.2rem !important;
          }

          /* Heading sizes */
          :where(.reader-container) h1 {
            font-size: 2rem !important;
            font-weight: 800 !important;
          }

          :where(.reader-container) h2 {
            font-size: 1.6rem !important;
            font-weight: 600 !important;
          }

          /* Captions */
          :where(.reader-container) :where(
            p[class*="caption"],
            div[class*="caption"] p,
            figcaption,
            figcaption *
          ) {
            color: gray !important;
            font-size: 0.8rem !important;
            line-height: 1.2 !important;
          }

          /* Disable link behavior */
          :where(.reader-container) :where(
            a.disabled-link,
            p a u
          ) {
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

  function enforceCleanTypography() {
    document.querySelectorAll(".reader-container p").forEach((p) => {
      p.style.setProperty("font-family", "Noto Serif, serif", "important");
      p.style.setProperty("font-size", "1.2rem", "important");
      p.style.setProperty("line-height", "1.3", "important");
      p.style.setProperty("font-weight", "400", "important");
      p.style.setProperty("font-style", "normal", "important");
      p.style.setProperty("font-optical-sizing", "auto", "important");
      p.style.setProperty("font-variation-settings", '"wdth" 100', "important");
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
      enforceCleanTypography();
    }, 100); // Slight delay to avoid React re-render collision
  });

  document.querySelectorAll("strong").forEach((strong) => {
    // Replace the <strong> with its inner content
    strong.replaceWith(...strong.childNodes);
  });

  injectCustomStyles();
  removeElements();
  enforceCleanTypography();
  observer.observe(document.body, { childList: true, subtree: true });
})();

/* Create wrapper for padding */
function wrapReaderContent() {
  console.log("[Reader] wrapReaderContent() called.");

  const existingWrapper = document.querySelector(".reader-container");

  if (existingWrapper) {
    console.warn("[Reader] Wrapper already exists — skipping creation.");
    console.log("[Reader] Existing wrapper:", existingWrapper);
    return existingWrapper;
  }

  const body = document.body;
  if (!body) {
    console.error(
      "[Reader] document.body not found — this should never happen."
    );
    return null;
  }

  console.log(
    "[Reader] document.body found. Child nodes count:",
    body.childNodes.length
  );

  const wrapper = document.createElement("div");
  wrapper.className = "reader-container";

  console.log("[Reader] Created wrapper element:", wrapper);

  // Move children into the wrapper
  let moved = 0;
  while (body.firstChild) {
    wrapper.appendChild(body.firstChild);
    moved++;
  }

  console.log(`[Reader] Moved ${moved} node(s) into wrapper.`);

  // Re-attach wrapper to body
  try {
    body.appendChild(wrapper);
    console.log("[Reader] Wrapper appended to body successfully.");
  } catch (err) {
    console.error("[Reader] Failed to append wrapper to body:", err);
    return null;
  }

  // Verify presence
  const check = document.querySelector(".reader-container");
  if (check) {
    console.log(
      "[Reader] Wrapper successfully found in document after append."
    );
  } else {
    console.error(
      "[Reader] Wrapper NOT found after append — something removed it!"
    );
  }

  return wrapper;
}
