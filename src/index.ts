import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swaggerConfig";

// sequelize models
import { Sequelize } from "sequelize";
import { Client } from "./db/Client";
import { Table } from "./db/Table";
import { Reservation } from "./db/Reservation";
import { Restaurant } from "./db/Restaurant";

// routers
import { NewClientRouter } from "./routes/ClientRouter";
import { NewRestaurantRouter } from "./routes/RestaurantRouter";

// -----------------
// | connect to db |
// -----------------
const db_uri = "sqlite:memmory:";
const connection = new Sequelize(db_uri);

// configure our sequelize models
Client.configure(connection);
Table.configure(connection);
Reservation.configure(connection);
Restaurant.configure(connection);

connection.sync().then();
connection.authenticate();

//  ----------------
// | express config |
//  ----------------
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;

// directory for static files
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api/client", NewClientRouter());
app.use("/api/restaurant", NewRestaurantRouter());

// main ui window
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/index/client", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
