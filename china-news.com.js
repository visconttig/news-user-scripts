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
