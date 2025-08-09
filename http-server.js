const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;

http
  .createServer((req, res) => {
    let filePath = "." + req.url;
    if (filePath === "./") {
      filePath = "./index.html"; // fallback if needed
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      ".js": "application/javascript",
      ".json": "application/json",
      ".html": "text/html",
      ".css": "text/css",
      ".txt": "text/plain",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code == "ENOENT") {
          res.writeHead(404);
          res.end("Not Found");
        } else {
          res.writeHead(500);
          res.end("Server Error: " + error.code);
        }
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  })
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
