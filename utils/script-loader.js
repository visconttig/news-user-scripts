// ==UserScript==
// @name         Dev Loader (JSON manifest)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const serverRoot = "http://localhost:8080/";
  const manifestUrl = serverRoot + "manifest.json";
  const injected = new Set();
  const url = location.href;

  function matchPattern(pattern, url) {
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    const regex = new RegExp("^" + escaped + "$");
    return regex.test(url);
  }

  function scriptShouldLoad(patterns) {
    if (!Array.isArray(patterns)) return false;
    if (patterns.includes("*")) return true;
    return patterns.some((p) => matchPattern(p, url));
  }

  function injectInlineScript(code, name) {
    const id = "gm-dev-" + name.replace(/[^\w-]/g, "_");
    if (injected.has(id) || document.getElementById(id)) return;
    injected.add(id);

    const s = document.createElement("script");
    s.id = id;
    s.textContent = code + `\n//# sourceURL=${serverRoot}${name}`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();

    console.log(`Injected (inline): ${name}`);
  }

  function injectFromBlob(code, name, type) {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const s = document.createElement("script");
    if (type) s.type = type;
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
          injectInlineScript(res.responseText, name);
        } catch (e) {
          console.warn(`Inline inject failed for ${name}`, e);
          injectFromBlob(res.responseText, name, "");
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

        if (!scripts || typeof scripts !== "object") {
          console.error("Manifest 'scripts' must be an object");
          return;
        }

        console.log("Manifest loaded:", scripts);

        Object.entries(scripts).forEach(([name, patterns]) => {
          if (scriptShouldLoad(patterns)) {
            console.log(`✔ Loading script: ${name}`);
            loadScript(name);
          } else {
            console.log(`✘ Skipped script: ${name}`);
          }
        });
      } catch (e) {
        console.error("Invalid manifest:", e);
      }
    },
    onerror: (err) => console.error("Error loading manifest.json:", err),
  });
})();
