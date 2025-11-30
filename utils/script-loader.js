// ==UserScript==
// @name         Dev Loader (JSON manifest)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-start
// ==/UserScript==

/*
███████ BIG FAT REMINDER ███████

Every time you edit this loader:
→ UPDATE THE SCRIPT IN TAMPERMONKEY ←

If you don’t, you’ll spend 45 minutes debugging
ghosts, illusions, and yesterday’s code.
Seriously. Update it. Do it now.

(Yes, Future Gerónimo… this message is for YOU.)
*/

(function () {
  "use strict";

  const localDevServerRoot = "http://localhost:8080/";
  const manifestJsonUrl = localDevServerRoot + "manifest.json";

  // Track scripts injected for this page session (helps with SPA nav)
  const injectedScriptIds = new Set();

  const currentPageUrl = location.href;

  function doesUrlMatchWildcard(pattern, url) {
    const escapedPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");

    const regex = new RegExp("^" + escapedPattern + "$");
    return regex.test(url);
  }

  function shouldInjectForThisPage(patternList) {
    if (!Array.isArray(patternList)) return false;

    let matchedPositiveRule = false;

    for (const rule of patternList) {
      const isNegationRule = rule.startsWith("!");
      const cleanedPattern = isNegationRule ? rule.slice(1) : rule;

      const matches = doesUrlMatchWildcard(cleanedPattern, currentPageUrl);

      if (!isNegationRule && matches) {
        matchedPositiveRule = true;
      }

      if (isNegationRule && matches) {
        return false; // an exclusion rule always wins
      }
    }

    return matchedPositiveRule;
  }

  function injectInlineScript(javascriptSource, fileName) {
    const safeId = "gm-dev-" + fileName.replace(/[^\w-]/g, "_");

    if (injectedScriptIds.has(safeId) || document.getElementById(safeId))
      return;
    injectedScriptIds.add(safeId);

    const scriptElement = document.createElement("script");
    scriptElement.id = safeId;
    scriptElement.textContent =
      javascriptSource + `\n//# sourceURL=${localDevServerRoot}${fileName}`;

    (document.head || document.documentElement).appendChild(scriptElement);
    scriptElement.remove();

    console.log(`Injected (inline): ${fileName}`);
  }

  function injectViaBlob(javascriptSource, fileName, scriptType) {
    const blob = new Blob([javascriptSource], { type: "text/javascript" });
    const blobUrl = URL.createObjectURL(blob);

    const scriptElement = document.createElement("script");
    if (scriptType) scriptElement.type = scriptType;
    scriptElement.src = blobUrl;

    (document.head || document.documentElement).appendChild(scriptElement);
    scriptElement.onload = scriptElement.onerror = () =>
      URL.revokeObjectURL(blobUrl);

    console.log(`Injected (blob): ${fileName}`);
  }

  function fetchAndInjectScript(fileName) {
    GM_xmlhttpRequest({
      method: "GET",
      url: localDevServerRoot + fileName,
      onload: (res) => {
        try {
          injectInlineScript(res.responseText, fileName);
        } catch (err) {
          console.warn(`Inline inject failed for ${fileName}`, err);
          injectViaBlob(res.responseText, fileName, "");
        }
      },
      onerror: (err) => console.error(`Error loading script ${fileName}:`, err),
    });
  }

  GM_xmlhttpRequest({
    method: "GET",
    url: manifestJsonUrl,
    onload: (res) => {
      try {
        const { scripts } = JSON.parse(res.responseText);

        if (!scripts || typeof scripts !== "object") {
          console.error("Manifest 'scripts' must be an object");
          return;
        }

        console.log("Manifest loaded:", scripts);

        Object.entries(scripts).forEach(([fileName, urlPatterns]) => {
          if (shouldInjectForThisPage(urlPatterns)) {
            console.log(`✔ Loading script: ${fileName}`);
            fetchAndInjectScript(fileName);
          } else {
            console.log(`✘ Skipped script: ${fileName}`);
          }
        });
      } catch (err) {
        console.error("Invalid manifest:", err);
      }
    },
    onerror: (err) => console.error("Error loading manifest.json:", err),
  });
})();
