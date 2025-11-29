// ==UserScript==
// @name         BBC Reader (#BBC Brazil)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Inject custom styles
  function injectCustomStyles() {
    const style = document.createElement("style");

    //inlineLinks: "a[class='focusIndicatorReducedWidth'][href]"
    style.textContent = /* css */ `
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


  #main-navigation-container, 
  header {
    display: none !important;
    z-index: -9999 !important;
  }

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
  hideElements();
  disableTargetedLinks();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      hideElements();
      disableTargetedLinks();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
