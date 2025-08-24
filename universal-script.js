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

  function injectGoogleFonts() {
    const head = document.head;

    // preconnect to fonts.googleapis.com
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    head.appendChild(preconnect1);

    // preconnect to fonts.gstatic.com with crossorigin
    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    head.appendChild(preconnect2);

    // the actual font stylesheet
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap";
    head.appendChild(fontLink);
  }

  // Call this early in your script
  injectGoogleFonts();

  function injectCustomStyles() {
    const style = document.createElement("style");
    style.textContent = /* css */ `


html {
  font-size: 10px !important;
}

 body, * {
   font-family: "Noto Serif", serif !important;
   // background-color: rgb(255, 255, 255) !important;
   //background-color: rgb(0,0,0) !important;
   line-height: 20px !important;
   //color: white !important;
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


 h1, h2, h3, h4, h5, h6 {
     line-height: 30px !important;
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
    font-size: 1.8rem !important;
}

a.disabled-link, p a u {
    pointer-events: none !important;
    color: inherit !important;
    text-decoration: none !important;
    border-bottom: none !important;
 }

                @media (min-width: 63rem) {
    *[class*="bbc-"] {
        grid-column: unset !important;
        grid-template-columns: none !important;
        max-width: 100% !important;
    }
  }


    .story-layout .storytitle, .story-layout .story-meta, .story-layout .story #headlineaudio, .story-layout .storytext>p, .story-layout .storytext>.edTag, .story-layout .storytext>blockquote, .story-layout .storytext>.bucketwrap.list, .story-layout .supplementarycontent>.bucketwrap.list, .story-layout .breadcrumb, .story-layout .story>.slug-wrap, .story-layout .correction, .story-layout .date-block-affiliation-wrap, .story-layout .story>.tags, .story-layout .story>.social-wrap, .story-layout .story>.correction, .story-layout .hr, .story-layout .tmplMusicSongsStreamPlaylist .playlistwrap, .story-layout .bucketwrap.resaudio, .story-layout .share-tools--secondary, .story-layout .transcript .icn-story-transcript-wrap, .story-layout .story .callout, .story-layout .story .callout-end-of-story-mount-piano-wrap, .story-layout .org-promo, .story-layout .bucketwrap.twitter.large, .story-layout .storytext>.container.large, .story-layout .bucketwrap {
    max-width: 100% !important;
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
