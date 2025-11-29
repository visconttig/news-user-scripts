// ==UserScript==
// @name         Alura (#Alura)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.app.aluracursos.com/*
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
    aiAssistantCta: "div.chatbot-cta",
    toxicAiAssistantBox: "section#chatbot-suggested-messages-transcription",
    discussInForumButton:
      "a[class*='task-actions-button task-actions-button-forum']",
    videoTranscription: "section#transcription",
    transcriptionButton:
      "button[class*='video-transcription-button transcription-toggle']",
    foroLink: "a[class*='task-menu-others-link task-menu-others-link-forum']",
    redundantProfileLink: "section.task-menu-footer",
    unusedSettingsButton: "div[class*='theater-video settings']",
    redundantMenu: "section[class*='task-menu-others']",
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
