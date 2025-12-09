// ==UserScript==
// @name         BBC Reader (#BBC Brazil)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.bbc.com/*
// @grant        none
// ==/UserScript==

/*  
------------------------------------------------------------
HEY FUTURE ME — READ THIS BEFORE TOUCHING ANYTHING 😤

BBC applies *multiple* padding rules to `.css-1nfgtt7`:

1) A global mobile-first rule:
      .css-1nfgtt7 { padding: ... }

2) A desktop/tablet breakpoint rule:
      @media (min-width: 37.5rem) {
         .css-1nfgtt7 { padding: ... }
      }

These come from DIFFERENT stylesheets at DIFFERENT cascade layers.
Because of that, overriding just ONE of them is NOT enough.

- Remove the mobile override → mobile padding returns.
- Remove the desktop override → desktop padding returns.

So if the layout looks broken again, it’s not magic —  
it’s BBC stacking two sources of truth, and both must be beaten.

TL;DR: ✔ Always override BOTH sources  
       ✔ Or use a single, high-specificity selector (e.g. `body .css-1nfgtt7`)  
------------------------------------------------------------
*/

(function () {
  "use strict";

  // Inject custom styles
  function injectCustomStyles() {
    const style = document.createElement("style");

    //inlineLinks: "a[class='focusIndicatorReducedWidth'][href]"
    style.textContent = /* css */ `

            .test {
                border: 7px dashed red !important;
            }

            .bbc-hidden {
                display: none !important;
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


          // BBC paragraphs
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

        // BBC images
        @media screen and (max-width: 1279px) {
            .GunZh {
                width: 100% !important;
            }

        }

        .GunZh
        {
            width: 100% !important;
        }

        // BBC videos
        @media screen and (max-width: 1279px) {
            .gXrNRM {
                width: 100% !important;
            }
        }

        // videos
        .gXrNRM {
            width: 100% !important;
        }


        // BBC images slider
        @media screen and (max-width: 1279px) {
            .Qwxkf {
                width: 100% !important;
            }
        }

        .Qwxkf {
            width: 100% !important;
        }


      // Video-articles
      @media screen and (max-width: 1279px) {
          .cxmRwZ {
              width: 100% !important;
          }
      }

      @media screen and (max-width: 8192px) {
          .cxmRwZ {
              width: 100% !important;
          }
      }


      #main-navigation-container, 
      header {
        display: none !important;
        z-index: -9999 !important;
      }


        // Unnecessary space before article's title
      @media (min-width: 37.5rem) {
        .css-1nfgtt7 {
            padding: 0 0 !important;
        }
    }

    @media (min-width: 0) {
      body .css-1nfgtt7 {
        padding: 0 !important;
      }
    }

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

  const selectorMap = {
    header: "header[role='banner']",
    articleInfo: "section[aria-labelledby='article-byline']",
    whatsappAd: "section[aria-labelledby='podcast-promo']",
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
    moreRelated: "div[data-testid='texas-section']",
    socialLinks: "div[data-testid='tagsAndSocialStyled']",
    time: "time",
    liveUrl: "ul[class*='sc-6f869981-0 diUlgm']",
    relatedVideos: "div[data-testid='hawaiiVerticalVideoListStyled']",
    tagsZh: "div[data-component='tags']",
    imageCreditsZh: "p[class='css-1276odk']",
    innerAds3: "section[data-e2e='advertisement']",
    innerAds4: "div[data-testid='ad-unit']",
  };

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

  const hideElements = () => {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("bbc-hidden")) {
          el.classList.add("bbc-hidden");
          console.log(`👻 Hidden [${label}]`, el);
        }
      });
    });
  };

  function disableTargetedLinks() {
    const links = document.querySelectorAll(
      "a[class*='focusIndicatorReducedWidth'][href]"
    );
    links.forEach((link) => {
      // Avoid attaching multiple times
      if (!link.dataset.bbcLinkDisabled) {
        link.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🚫 Link disabled:", link.href);
          },
          true
        ); // Use capture phase to intercept early
        link.dataset.bbcLinkDisabled = "true";
      }
    });
  }

  // Initial run
  testSelectors();
  hideElements();
  disableTargetedLinks();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      testSelectors();
      hideElements();
      disableTargetedLinks();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
