// ==UserScript==
// @name         GM Dev Loader (JSON manifest)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function () {
  const serverRoot = "http://localhost:8080/";
  const manifestUrl = serverRoot + "manifest.json";

  GM_xmlhttpRequest({
    method: "GET",
    url: manifestUrl,
    onload: (res) => {
      try {
        const { scripts } = JSON.parse(res.responseText);
        console.log("Manifest loaded:", scripts);

        scripts.forEach((file) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: serverRoot + file,
            onload: (scriptRes) => {
              console.log(`Loaded: ${file}`);
              try {
                new Function(scriptRes.responseText)();
              } catch (err) {
                console.error(`Error executing ${file}:`, err);
              }
            },
          });
        });
      } catch (e) {
        console.error("Invalid manifest.json:", e);
      }
    },
    onerror: (err) => console.error("Error loading manifest.json:", err),
  });
})();
