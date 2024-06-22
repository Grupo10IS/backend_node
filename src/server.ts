import express from "express";
// import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swaggerConfig";

import { NewClientRouter } from "./routes/ClientRouter";
import { NewRestaurantRouter } from "./routes/RestaurantRouter";
import cors from "cors";
import { apiClientUrl, apiRestaurantUrl, apiTablesUrl } from "./constants";
import { NewTablesRouter } from "./routes/TablesRouter";

// Middleware to set Content-Type: application/json header
function setJsonContentType(req: any, res: any, next: any) {
    res.setHeader("Content-Type", "application/json");
    next();
}

// NOTE: this is because some weird behavior with vitest
export function initServer() {
    const app = express();

    // middlewares
    app.use(
        // morgan("dev"),
        cors(),
        express.json(),
        express.urlencoded({ extended: true })
    );

    // directory for static files
    app.use(express.static(path.join(__dirname, "../public")));

    // routes
    app.use(apiClientUrl, setJsonContentType, NewClientRouter());
    app.use(apiRestaurantUrl, setJsonContentType, NewRestaurantRouter());
    app.use(apiTablesUrl, setJsonContentType, NewTablesRouter());

    // -- ui routes --
    app.get("/ui", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return app;
}
