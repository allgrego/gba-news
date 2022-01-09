import * as express from "express";
import * as cors from "cors";

// import clientRoutes from "./routes/clients";
import newsRoutesV1 from "./routes/v1";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// Global middleware
app.use((req, res, next)=>{
  // Not too much for now
  next();
});

/**
 * Routes
 */
// News routes V1
app.use("/v1", newsRoutesV1);
// Rest
app.get("*", (req, res) => res.status(404).json({
  error: "not-found",
  message: "Invalid route",
}));

// Expose Express API as a single Cloud Function:
export default app;
