const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev, dir: path.join(__dirname) });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;
        if (
          pathname.startsWith("/_next/static/") ||
          pathname.startsWith("/public/") ||
          pathname === "/sw.js"
        ) {
          handle(req, res, parsedUrl);
        } else {
          app.render(req, res, pathname, parsedUrl.query);
        }
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal server error");
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
