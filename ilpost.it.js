// ==UserScript==
// @name         IlPost.it (#IlPost)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.ilpost.it/*
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


            .test {
                border: 7px dashed red !important;
            }


            main#index_main-content__nZYrw {
              max-width: 100% !important;
              margin: 0 0 !important;
            }

            // @media (min-width: 576px) {
            //     .container, .container-sm {
            //         // max-width: 540px;
            //         max-width: 100% !important;
            //         background-color: blue !important;
            //     }
            // }

            // @media (min-width: 768px) {
            //     .container, .container-md, .container-sm {
            //         // max-width: 720px;
            //         max-width: 100% !important;
            //         background-color: red !important;
            //     }
            // }

            // @media (min-width: 992px) {
            //   .container, .container-lg, .container-md, .container-sm {
            //       // max-width: 960px;
            //       max-width: 100% !important;
            //       background-color: green !important;
            //   }
            // }


//             @media (min-width: 0) {
//     .container, .container-sm, main#index_main-content__nZYrw {
//         max-width: 100% !important;
//         min-width: 100% !important;
//         padding: 0 0 !important;
//     }
// }



@media only screen and (min-width: 768px) {
    main#index_main-content__nZYrw .index_row-wrap__aFB00 .index_col-wrap__uWeUs article .index_main-content__image__DtJf_ figure {
        max-width: 100% !important;
    }
}

@media only screen and (min-width: 0) {
    main#index_main-content__nZYrw .index_row-wrap__aFB00 .index_col-wrap__uWeUs article .index_main-content__image__DtJf_ figure {
        max-width: 100% important;
    }
}

main#index_main-content__nZYrw .index_row-wrap__aFB00 .index_col-wrap__uWeUs article .index_main-content__image__DtJf_
 {
    width: 100vw;
    margin: 0 0 !important;
    text-align: unset !important;
}

@media screen and (min-width: 992px) {
    html .contenuto .wp-caption img {
        max-width: 100% !important;
    }
}

html .contenuto .wp-caption img {
    max-width: 100%;
    height: auto;
}

img {
    width: 100% !important;
    height: auto !important;
}



        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {};

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
    header: "header",
    metaInfo: "div[class*='_breadcrumbs']",
    shareButton: "div[class*='index_actions']",
    relatedArticles: "div[class*='index_main-content__after']",
    tags: "div[class*='index_art_tag']",
    footer: "footer[class*='footer-minimal']",
    introPicture:
      "main#index_main-content__nZYrw .index_row-wrap__aFB00 .index_col-wrap__uWeUs article .index_main-content__image__DtJf_ figure",
    interleavedArticle1: "div#ilpost_gam_article_par_6",
    interleavedArticle: "div#mapp_article_par_6",
    interleavedArticle99: "p:has(strong + a)",
    socialBox: "div.ilPostSocial",
    commentsButton: "div.index_il-post-comments___DMIs",
  };

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

  const removeElements = () => {
    Object.entries(selectorMap).forEach(([label, selector]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!el.classList.contains("unmounted")) {
          el.classList.add("unmounted");
          console.log(`Removed [${label}]`, el);
        }
      });
    });
  };

  // Initial run
  removeElements();
  testSelectors();

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
