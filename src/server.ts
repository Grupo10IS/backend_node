import express from "express";
// import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swaggerConfig";

import { NewClientRouter } from "./routes/ClientRouter";
import { NewRestaurantRouter } from "./routes/RestaurantRouter";
import cors from "cors";
import {
    apiCategoriaUrl,
    apiClientUrl,
    apiConsumoUrl,
    apiDetallesUrl,
    apiProductosUrl,
    apiReservationsUrl,
    apiRestaurantUrl,
    apiTablesUrl,
} from "./constants";
import { NewTablesRouter } from "./routes/TablesRouter";
import { NewReservationRouter } from "./routes/ReservationRouter";
import { NewCategoryRouter } from "./routes/CategoryRouter";
import { NewProductRouter } from "./routes/ProductsRouter";
import { NewConsumoRouter } from "./routes/ConsumoRouter";
import { NewDetalleRouter } from "./routes/DetallesRouter";

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
    app.use(apiReservationsUrl, setJsonContentType, NewReservationRouter());
    app.use(apiCategoriaUrl, setJsonContentType, NewCategoryRouter());
    app.use(apiProductosUrl, setJsonContentType, NewProductRouter());
    app.use(apiConsumoUrl, setJsonContentType, NewConsumoRouter());
    app.use(apiDetallesUrl, setJsonContentType, NewDetalleRouter());

    // docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return app;
}
