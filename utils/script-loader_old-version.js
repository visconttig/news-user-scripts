// ==UserScript==
// @name         GM Dev Loader (JSON manifest) — CSP-safe
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const serverRoot = "http://localhost:8080/";
  const manifestUrl = serverRoot + "manifest.json";

  // Track what we've injected to avoid duplicates on SPA navigations
  const injected = new Set();

  function injectInlineScript(code, name) {
    const id = "gm-dev-" + name.replace(/[^\w-]/g, "_");
    if (injected.has(id) || document.getElementById(id)) return;
    injected.add(id);

    const s = document.createElement("script");
    s.id = id;
    // Helpful for debugging in DevTools "Sources"
    const sourceURL = `\n//# sourceURL=${serverRoot}${name}`;
    s.textContent = code + sourceURL;

    // Use head if present, else documentElement
    (document.head || document.documentElement).appendChild(s);
    // Remove the node to keep DOM clean; code has already executed
    s.remove();
    console.log(`Injected (inline): ${name}`);
  }

  // Optional fallback if some site blocks inline scripts (not needed for BBC)
  function injectFromBlob(code, name, type /* '' or 'module' */) {
    const blob = new Blob([code + `\n//# sourceURL=${serverRoot}${name}`], {
      type: "text/javascript",
    });
    const url = URL.createObjectURL(blob);
    const s = document.createElement("script");
    if (type) s.type = type; // e.g. 'module'
    s.src = url;
    (document.head || document.documentElement).appendChild(s);
    s.onload = s.onerror = () => URL.revokeObjectURL(url);
    console.log(`Injected (blob): ${name}`);
  }

  function loadScript(name) {
    GM_xmlhttpRequest({
      method: "GET",
      url: serverRoot + name,
      onload: (res) => {
        try {
          // Primary path (CSP-safe on BBC): inline script tag (no eval)
          injectInlineScript(res.responseText, name);
        } catch (e) {
          console.warn(
            `Inline inject failed for ${name}, trying blob fallback`,
            e
          );
          injectFromBlob(res.responseText, name, ""); // try as classic script
        }
      },
      onerror: (err) => console.error(`Error loading ${name}:`, err),
    });
  }

  GM_xmlhttpRequest({
    method: "GET",
    url: manifestUrl,
    onload: (res) => {
      try {
        const { scripts } = JSON.parse(res.responseText);
        if (!Array.isArray(scripts)) {
          console.error('manifest.json missing "scripts" array');
          return;
        }
        console.log("Manifest loaded:", scripts);
        scripts.forEach(loadScript);
      } catch (e) {
        console.error("Invalid manifest.json:", e);
      }
    },
    onerror: (err) => console.error("Error loading manifest.json:", err),
  });
})();
