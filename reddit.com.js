// ==UserScript==
// @name         Reddit Reader (#Reddit)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description
// @match        https://www.reddit.com/*
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


        @media(min-width: 768px){
            .flex-grid--main-container-card.right-sidebar-xs {
            width: 100% !important;
            max-width: 100% !important;
            }
        }
        
        *[class*="display-none"] {
            display: none !important;
        }

        `;
    document.head.appendChild(style);
  }

  injectCustomStyles();

  const testSelectorsMap = {
    // all: "*",
    loginSider: "aside#right-rail-experience-root",
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

  /*  
───────────────────────────────────────────────────────────────
 ⚠️  !! DANGER SELECTOR — DO NOT USE  !!
───────────────────────────────────────────────────────────────

".flex-grid--main-container-card.right-sidebar-xs"

This selector looks innocent but on Reddit Mobile it wraps HUGE
chunks of the app, including article hydration roots.  

Removing it = TOTAL PAGE WIPEOUT 🧨  
(Black screen, no posts, no comments, no recovery.)

If you are reading this thinking  
"maybe it’s safe now…"  
NO. IT IS NOT. PUT THE KEYBOARD DOWN. 🖐️😂

This selector must stay UNUSED forever.
───────────────────────────────────────────────────────────────
*/

  const selectorMap = {
    sideBarContainer: "div#right-sidebar-container",
    subName: "div#pdp-credit-bar",
    header: "header",
    commentsAdd: "shreddit-comments-page-ad",
    returToSearch: "div#pdp-seeker-mweb-return-to-results",
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

  // Replace user names with placeholder
  function anonymizeUsernames() {
    const usernameLinks = document.querySelectorAll(
      'a[href^="/user/"]:not(.rr-username-masked)'
    );

    usernameLinks.forEach((a) => {
      a.textContent = "──────────"; // <= your zen placeholder
      a.classList.add("rr-username-masked"); // prevents double work
    });
  }

  function removeViewInApp() {
    const appBanner = [...document.querySelectorAll("span")].find(
      (el) => el.textContent.trim() === "View in Reddit App"
    );

    if (appBanner) {
      appBanner.closest("div.relative")?.remove();
    }
  }

  // Initial run
  removeElements();
  testSelectors();
  anonymizeUsernames();
  removeViewInApp();

  // Observe DOM changes and hide again
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      testSelectors();
      removeElements();
      anonymizeUsernames();
      removeViewInApp();
    }, 100); // Slight delay to avoid React re-render collision
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

// ------- Robust Reddit "Read more" expander -------
(function setupRobustExpander() {
  let attemptCounter = 0;
  const maxAttempts = 20; // how many times we'll retry per page load
  const baseDelay = 120; // ms initial retry delay
  let backoff = baseDelay;

  function isVisible(el) {
    if (!el) return false;
    if (el.offsetParent === null) return false; // hidden by display:none or similar
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    // optional: ensure at least some part in viewport
    return (
      rect.bottom > 0 &&
      rect.top < (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function simulatePointerAndClick(target) {
    try {
      const props = { bubbles: true, cancelable: true, view: window };

      // pointer sequence
      const pointer = new PointerEvent("pointerover", props);
      target.dispatchEvent(pointer);
      target.dispatchEvent(new PointerEvent("pointerenter", props));
      target.dispatchEvent(new PointerEvent("pointerdown", props));
      target.dispatchEvent(new PointerEvent("pointerup", props));

      // mouse sequence
      target.dispatchEvent(new MouseEvent("mouseenter", props));
      target.dispatchEvent(new MouseEvent("mousedown", props));
      target.dispatchEvent(new MouseEvent("mouseup", props));
      target.dispatchEvent(new MouseEvent("click", props));

      // focus + keyboard fallback
      target.focus && target.focus();
      target.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          bubbles: true,
          cancelable: true,
        })
      );
      target.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          bubbles: true,
          cancelable: true,
        })
      );

      // also try the parent in case listeners are delegated up
      if (target.parentElement) {
        target.parentElement.dispatchEvent(new MouseEvent("click", props));
      }
    } catch (err) {
      console.warn("[expander] simulatePointerAndClick error:", err);
    }
  }

  function markHandled(node) {
    if (!node) return;
    node.dataset.__reader_expanded = "1";
  }
  function alreadyHandled(node) {
    return node && node.dataset && node.dataset.__reader_expanded === "1";
  }

  function tryExpandOnce() {
    attemptCounter++;
    if (attemptCounter > maxAttempts) {
      // give up for this page load
      // but keep observers active so a later navigation can trigger it again
      console.warn(
        "[expander] reached max attempts; will stop auto retries for now."
      );
      return;
    }

    // match any post's read-more button (IDs vary per post)
    const btn = document.querySelector('button[id$="read-more-button"]');

    if (!btn) {
      scheduleRetry();
      return;
    }

    // If the found node has been handled -> nothing to do
    if (alreadyHandled(btn)) {
      // But if it's not visible, schedule a retry in case it's re-mounted visible later
      if (!isVisible(btn)) scheduleRetry();
      return;
    }

    // If it's not visible/actionable yet, wait for it to become visible
    if (!isVisible(btn)) {
      // attach an intersection observer (short lived) to know when it appears
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              io.disconnect();
              // small timeout to let Reddit settle
              setTimeout(() => {
                tryExpandOnce();
              }, 80);
              return;
            }
          }
        },
        { root: null, threshold: 0.01 }
      );

      try {
        io.observe(btn);
      } catch (err) {
        /* ignore */
      }
      scheduleRetry();
      return;
    }

    // Ok looks visible. Attempt to click with full event sequence.
    console.log(
      "[expander] found visible read-more button -> simulating user events",
      btn
    );
    simulatePointerAndClick(btn);

    // mark this node so replacements get re-clicked as new nodes won't have the mark
    markHandled(btn);

    // short follow-up check: if the node still exists and is not removed, maybe clicking didn't work.
    setTimeout(() => {
      // if it's still in DOM and not removed AND some condition that indicates "still collapsed"
      const stillThere = document.contains(btn);
      // heuristic: the button often disappears after expanding. If it's still there, try again after a small delay.
      if (stillThere && !alreadyHandled(btn + "_final")) {
        // try one more programmatic click (avoid infinite attempts by setting a marker)
        console.log(
          "[expander] button still present after click — retrying once more"
        );
        simulatePointerAndClick(btn);
        // set a final marker on node reference to avoid re-retrying same node repeatedly
        try {
          btn.dataset.__reader_expanded_final = "1";
        } catch (e) {}
      }
    }, 220);
  }

  function scheduleRetry() {
    backoff = Math.min(1500, Math.floor(backoff * 1.7)); // gentle exponential backoff
    setTimeout(tryExpandOnce, backoff + Math.random() * 80);
  }

  // Kick it once now:
  tryExpandOnce();

  // Observe DOM for new nodes that match — this triggers fast when reddit re-renders the button
  const domObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        // small heuristics: if any added node contains the read-more id pattern, trigger
        for (const n of m.addedNodes) {
          if (!(n instanceof Element)) continue;
          if (
            n.querySelector &&
            n.querySelector('button[id$="read-more-button"]')
          ) {
            // immediate attempt
            tryExpandOnce();
            return;
          }
          // or the node itself could be the button:
          if (n.matches && n.matches('button[id$="read-more-button"]')) {
            tryExpandOnce();
            return;
          }
        }
      }
    }
  });

  domObserver.observe(document.body, { childList: true, subtree: true });

  // Also re-run when the viewport resizes / orientation changes (mobile)
  window.addEventListener("orientationchange", () =>
    setTimeout(tryExpandOnce, 200)
  );
  window.addEventListener("resize", () => setTimeout(tryExpandOnce, 140));

  console.log("[expander] robust expander installed");
})();
