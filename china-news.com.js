// ==UserScript==
// @name         Chinese Reader (#ChinaNews)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.chinanews.com/*
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
                background-color: rgba(97, 97, 97, 1) !important;
            }

            div#second-title {
                display: none !important;
            }

            div.content_maincontent_content p:last-of-type {
                display: none !important;
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

            body, 
            div p,
            figcaption span {
                // font-size: 2rem !important;
                font-size: 1.6rem !important;
                font-family: "Noto Serif SC", serif !important;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
            }

// Override font
.css-nir6jv,
div div h1#content.article-heading,
h1#content.article-heading.css-nir6jv {
  font-family: "Noto Serif SC", serif !important;
  border: 5px dashed red !important;
  color: yellow !important;
}



            FIGCAPTION SPAN {
                // FONT-SIZE: 1.4REM !IMPORTANT;
                FONT-SIZE: 1REM !IMPORTANT;
                COLOR: GREY !IMPORTANT;
            }



body, p, li, blockquote, article, section, h1, h2, h3, h4, h5, h6 {
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
    navBar: "div#navbar",
    leftNavBar: "div.con_left_nav",
    sider: "div.con_right",
    selectedNews: "div.selected_news_wrapper",
    footer: "div.pagebottom",
    downloadRibbon: "div.download_wrapper",
    commentsSection: "div.comment_wrapper",
    channelButton: "div.channel",
    editorInfo: "div.adEditor",
    redundantTime: "div.content_left_time",
    commentsWrapper: "div.comment_wrapper",
    downloadWrapper: "div.download_wrapper",
  };

  // Flatten to use in querySelectorAll
  const selectors = Object.values(selectorMap).join(", ");

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

  // Initial run
  removeElements();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      removeElements();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
