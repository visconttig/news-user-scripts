// ==UserScript==
// @name         Inoreader - Bulk Add URLs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bulk-add URLs using DOM clicks
// @match        *://*.inoreader.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // ---------- CONFIG ----------
  const INTERVAL_OPEN_MS = 1000; // wait after clicking "Add" for the modal to open
  const INTERVAL_AFTER_PASTE_MS = 3000; // wait after setting input before submitting
  const INTERVAL_BETWEEN_URLS_MS = 1200; // wait after submit before starting next URL
  // ----------------------------

  // Add a small UI panel
  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.right = "450px";
  panel.style.top = "250px";
  panel.style.zIndex = "99999";
  panel.style.background = "rgba(255,255,255,0.95)";
  panel.style.border = "1px solid #aaa";
  panel.style.padding = "10px";
  panel.style.width = "360px";
  panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  panel.innerHTML = `
        <div style="font-weight:600;margin-bottom:6px">Bulk Add URLs</div>
        <textarea id="bulkUrls" placeholder="Paste one URL per line" style="width:100%;height:140px"></textarea>
        <div style="margin-top:8px;display:flex;gap:6px">
            <button id="startBulk">Start</button>
            <button id="stopBulk">Stop</button>
            <span id="status" style="margin-left:8px;color:#222"></span>
        </div>
    `;
  document.body.appendChild(panel);

  let stopFlag = false;
  document.getElementById("stopBulk").addEventListener("click", () => {
    stopFlag = true;
    setStatus("Stopped.");
  });

  function setStatus(s) {
    document.getElementById("status").innerText = s;
    console.log("[BulkAdd] " + s);
  }

  async function waitFor(selector, timeout = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await new Promise((r) => setTimeout(r, 100));
    }
    return null;
  }

  async function clickAddButton() {
    // adjust selector if needed
    const btn =
      document.querySelector(".add-url-dropdown > a") ||
      document.querySelector('a[data-bs-toggle="dropdown"]');
    if (!btn) return false;
    btn.click();
    return true;
  }

  async function submitCurrentForm() {
    // Try to find a submit button in the opened dropdown/modal:
    // there's no explicit submit in the snippet; pressing Enter on input usually works.
    const input = document.querySelector("#save-url");
    if (!input) return false;

    // Try to find a form element and submit it
    const form = input.closest("form");
    if (form) {
      // Some web apps prevent native submit; try clicking a visible button first
      const submitBtn = form.querySelector(
        'button[type="submit"], .btn-primary, .btn-success'
      );
      if (submitBtn) {
        submitBtn.click();
        return true;
      }
      // fallback: dispatch submit event
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      return true;
    }

    // fallback: press Enter on the input
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      })
    );
    input.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      })
    );
    return true;
  }

  async function setInputValueAndDispatch(url) {
    const input = await waitFor("#save-url", 2000);
    if (!input) return false;
    input.focus();

    // set value and dispatch input events so frameworks (React/Vue) notice it
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(input, url);

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  document.getElementById("startBulk").addEventListener("click", async () => {
    stopFlag = false;
    const raw = document.getElementById("bulkUrls").value.trim();
    if (!raw) {
      setStatus("Paste URLs first.");
      return;
    }
    const urls = raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    setStatus(`Starting ${urls.length} URLs...`);
    console.log("[BulkAdd] URLs to process:", urls);

    for (let i = 0; i < urls.length; i++) {
      if (stopFlag) break;
      const url = urls[i];
      setStatus(`Processing ${i + 1}/${urls.length}: ${url}`);
      console.log(`[BulkAdd] (${i + 1}/${urls.length}) clicking Add...`);

      const okClick = await clickAddButton();
      if (!okClick) {
        console.error("[BulkAdd] Add button not found. Aborting.");
        setStatus("Add button not found (check selector).");
        return;
      }

      await new Promise((r) => setTimeout(r, INTERVAL_OPEN_MS));

      const okSet = await setInputValueAndDispatch(url);
      if (!okSet) {
        console.error(
          "[BulkAdd] Input #save-url not found after opening. Aborting."
        );
        setStatus("Input not found. Aborting.");
        return;
      }
      console.log("[BulkAdd] Pasted URL into input.");

      await new Promise((r) => setTimeout(r, INTERVAL_AFTER_PASTE_MS));

      const okSubmit = await submitCurrentForm();
      if (!okSubmit) {
        console.warn(
          "[BulkAdd] Could not submit via form/button; trying Enter key."
        );
        // fallback: try native Enter on input again
        const input = document.querySelector("#save-url");
        if (input) {
          input.focus();
          input.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
              bubbles: true,
              cancelable: true,
            })
          );
          input.dispatchEvent(
            new KeyboardEvent("keyup", {
              key: "Enter",
              bubbles: true,
              cancelable: true,
            })
          );
        }
      }

      console.log("[BulkAdd] Submitted.");
      await new Promise((r) => setTimeout(r, INTERVAL_BETWEEN_URLS_MS));
    }
    setStatus("Done.");
    console.log("[BulkAdd] Finished.");
  });
})();
