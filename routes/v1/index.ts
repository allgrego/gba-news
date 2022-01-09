import {https, logger} from "firebase-functions";
import {Router} from "express";
import credentials from "../../config/credentials";
import fetch from "cross-fetch";
import {parse} from "node-html-parser";

const router = Router();

// Authentication Middleware for v1 routes
router.use((req, res, next) => {
  // Super permission if public key
  if (req.query.publickey===credentials.superPass) {
    logger.info("Requested with public key");
    next();
  } else if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    // If not, check bearer token
    res.status(403).send("Unauthorized");
    return;
  } else {
    // Provided Bearer token
    const bearerToken = req.headers.authorization!.split("Bearer ")[1];
    // Verify token
    if (bearerToken === credentials.bearerToken) next();
    else res.status(403).send("Unauthorized");
    return;
  }
});

// Index
router.get("/", (req, res)=>res.json({
  name: "GBA News",
  description: "API for for management of news from different providers.",
  version: "1.1.0",
}));

// Mundo maritimo
router.use("/mundomaritimo", async (req, res)=>{
  try {
    res.set("Cache-Control", "public, max-age=1800, s-maxage=3600");
    // URL for Mundo Marítimo News
    const baseUrl = "https://www.mundomaritimo.cl";
    const url = baseUrl + "";
    // Fetch the website
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    // Get the body as a text
    const body: string = await response.text();
    // Verify if server response is ok
    if (response.ok) {
      // Parse html
      const root = parse(body);
      // Initialize array of news as empty
      const news : any[] = [];
      // Maximum number of news to retrieve
      const MAX_AMOUNT_OF_NEWS = 12;
      // Query packages of news
      root.querySelectorAll(".cuatro_noticias").forEach((newsCont)=>{
        // Query news
        const bufferNews = newsCont.querySelectorAll(".noticia");
        // Iterate on each news
        bufferNews.forEach((n) => {
          // Add news if there are less than MAX AMOUNT
          if (news.length<MAX_AMOUNT_OF_NEWS) news.push(n);
          // Else, finish loop
          else return;
        });
      });
      // Parse the data of each news if there are any
      if (news.length) {
        // Auxiliar Buffer to store each parsed news
        const newsBuffer: any = [];
        // Iterate on each news
        news.forEach((m: any, i: number) => {
          // Image
          const image = {
            src: baseUrl + m.querySelector("img").getAttribute("src").toString(),
            width: m.querySelector("img").getAttribute("width").toString(),
          };
          // Date of news
          const date = m.querySelector(".group-txt-not").querySelector("span").text;
          // Title of news
          const title = m.querySelector("p.text_not").text;
          // Description of news
          const description = m.querySelector("span.bajada").text;

          const newsUrl = baseUrl + "/" + m.querySelector("a").getAttribute("href");
          // Structure of news to save
          const currentNews = {
            id: i + 1,
            title,
            description,
            date,
            image,
            url: newsUrl,
          };
          // Save news in buffer
          newsBuffer.push(currentNews);
        });
        //  Get today date
        const todayDate = new Date();
        const day = String(todayDate.getDate()).padStart(2, "0");
        const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // January is 0!
        const year = todayDate.getFullYear();
        const today = `${year}-${month}-${day}`;
        // JSON Response
        const jsonResponse = {
          metadata: {
            lastUpdate: {timestamp: Date.now(), date: today},
            source: baseUrl,
          },
          data: newsBuffer,
        };
        // Respond to client with news
        res.json(jsonResponse);
        return;
      }
      // Throw an error if there are no news
      throw new https.HttpsError("not-found", "No news obtained");
    } else {
      // Throw an error if there are no answer of news provider (website)
      throw new https.HttpsError("cancelled", "Failed response of news provider");
    }
  } catch (error) {
    logger.error(error);
    // Set status code (internal or bad request)
    res.status(error.code === "internal" ? 500 : 400);
    // Send error response
    res.json({
      error: {
        code: error.code || "internal",
        message: error.message || "INTERNAL",
        details: error.details || undefined,
      },
    });
    return;
  }
});

export default router;
