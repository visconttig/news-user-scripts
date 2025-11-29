// ==UserScript==
// @name         Ny-TimesCN (#NytCN)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://bbc.com/zhongwen/*
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

            body, 
            div p,
            figcaption span {
                font-size: 2rem !important;
                font-family: "Noto Serif SC", serif !important;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
            }

            figcaption span {
                font-size: 1.4rem !important;
                color: grey !important;
            }


              #main-navigation-container, 
  header {
    display: none !important;
    z-index: -9999 !important;
  }

              a[class*='focusIndicatorReducedWidth'][href] {
                text-decoration: none;
                color: inherit;
                cursor: initial;
                border-bottom: none;
            }


                @media (min-width: 63rem) {
    *[class*="bbc-"] {
        grid-column: unset !important;
        grid-template-columns: none !important;
        max-width: 100% !important;
    }

    .css-1cvxiy9 {
      grid-column: 1 / 13 !important;
    }
  }


  // BBC Chinese (in English) paragraphs
  @media screen and (max-width: 1279px) {
    .dPVOKT {
        width: 100% !important;
    }    

        .hNbOGD {
        width: 100% !important;
    }
}

.dPVOKT {
    width: 100% !important;
}

.hNbOGD {
    width: 100% !important;
}

// BBC Chinese (in English) images
@media screen and (max-width: 1279px) {
    .GunZh {
        width: 100% !important;
    }

}

.GunZh
 {
    width: 100% !important;
}

// BBC Chinese (in English) videos
@media screen and (max-width: 1279px) {
    .gXrNRM {
        width: 100% !important;
    }
}

// videos
.gXrNRM {
    width: 100% !important;
}


// BBC Chinese (in English) images slider
@media screen and (max-width: 1279px) {
    .Qwxkf {
        width: 100% !important;
    }
}

.Qwxkf {
    width: 100% !important;
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

body {
  padding: 0 32px !important;
}

body, p, li, blockquote, article, section, h1, h2, h3, h4, h5, h6 {
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
  line-height: 1.7 !important;
}


h1, h2, h3, h4, h5, h6 {
  line-height: 1.25 !important;
}

a.disabled-link, p a u {
    pointer-events: none !important;
    color: inherit !important;
    text-decoration: none !important;
    border-bottom: none !important;
 }



            .test {
                border: 7px dashed red !important;
                background-color: rgba(97, 97, 97, 1) !important;
            }



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const selectorMap = {
    header: "header[role='banner']",
    articleInfo: "section[aria-labelledby='article-byline']",
    podcastPromo: "div[data-e2e='podcast-promo']",
    relatedSection: "section[data-e2e='recommendations-heading']",
    featuredContent: '[data-testid="features"]',
    mostRead: "section[aria-labelledby='recommendations-heading']",
    topStories: "div[data-testid='top-stories']",
    relatedTopics: "[aria-labelledby='related-topics']",
    relatedStories: "[aria-labelledby='related-content-heading']",
    endOfArticleMostRead: "[aria-labelledby='Most-Read']",
    imageCredits: "p[class='css-by8ykd']",
    imageCredits2: "span[class='sc-5340b511-2 jVqbAn']",
    authorCredits:
      "i[id='additional-reporting-by-martin-yip-and-gemini-cheng-in-hong-kong']",
    footer: "footer",
    sharteButtonsZh: "div[data-component='byline-block']",
    relatedZh: "div[data-testid='ohio-section-3']",
    moreArticlesZh: "div[data-testid='alaska-section']",
    relatedArtsZh: "div[data-component='links-block']",
    tagsZh: "div[data-component='tags']",
    imageCreditsZh: "p[class='css-1276odk']",
  };

  const testSelectorMap = {};

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

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

  function injectGoogleFont() {
    // Preconnect to fonts.googleapis.com
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    // Preconnect to fonts.gstatic.com with crossorigin
    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "";
    document.head.appendChild(preconnect2);

    // Actual font stylesheet
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap";
    document.head.appendChild(fontLink);
  }

  // Initial run
  removeElements();
  testSelectors();
  injectGoogleFont();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
      testSelectors();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
