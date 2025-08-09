// ==UserScript==
// @name         Local Dev Loader Multi-Script
// @namespace    http://tampermonkey.net/
// @description  Loads multiple local scripts during development
// @match        *://*/*
// @version      0.2
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @connect      127.0.0.1:8080
// ==/UserScript==

(function () {
  "use strict";

  const baseURL = "http://localhost:8080/";
  const indexFile = "scripts.json";

  console.log("[local-loader] userscript started");

  // Wrapper to do GET requests using GM_xmlhttpRequest (Tampermonkey API)
  function gmFetch(url, responseType = "text") {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType,
        onload(response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response);
          } else {
            reject(
              new Error(`Failed to load ${url}: status ${response.status}`)
            );
          }
        },
        onerror(err) {
          reject(err);
        },
      });
    });
  }

  async function fetchJSON(url) {
    console.log("[local-loader] fetching index:", url);

    const response = await gmFetch(url, "json");
    return response.response;
  }

  function fetchAndEvalScript(scriptName) {
    const url = baseURL + scriptName + "?_=" + Date.now();
    console.log("[local-loader] fetching script URL:", url);
    GM_xmlhttpRequest({
      method: "GET",
      url,
      onload(response) {
        console.log(
          `[local-loader] HTTP status for ${scriptName}:`,
          response.status
        );
        try {
          (0, eval)(response.responseText);
          console.log(`[local-loader] loaded script: ${scriptName}`);
        } catch (err) {
          console.error(`[local-loader] error evaluating ${scriptName}`, err);
        }
      },
      onerror(err) {
        console.error(`[local-loader] failed to fetch ${scriptName}`, err);
      },
    });
  }

  async function loadScripts() {
    try {
      const scripts = await fetchJSON(baseURL + indexFile + "?_=" + Date.now());
      if (!Array.isArray(scripts)) {
        throw new Error("scripts.json did not return an array");
      }
      for (const scriptName of scripts) {
        await fetchAndEvalScript(scriptName);
      }
      console.log("[local-loader] All scripts loaded");
    } catch (err) {
      console.error(
        "[local-loader] Failed to load scripts.json or scripts",
        err
      );
    }
  }

  // Start loading scripts
  loadScripts();
})();
