// src/index.ts
import express from "express";
import path from "path";

import { Sequelize } from "sequelize";

// models
import Cliente from "./models/Cliente";
import Mesa from "./models/Mesa";
import Reserva from "./models/Reserva";
import Restaurante from "./models/Restaurante";

// routers
import clientRouter from "./routes/clientRouter";

const app = express();
const port = 3000;

// -----------------
// | connect to db |
// -----------------
const db_uri = "sqlite::memmory:";
const connection = new Sequelize(db_uri);

// configure our models
Cliente.configure(connection);
Mesa.configure(connection);
Reserva.configure(connection);
Restaurante.configure(connection);

connection.sync().then();
connection.authenticate();

//  ----------------
// | express config |
//  ----------------
// directory for static files
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api/client", clientRouter);
// TODO: anadir mas rutas

// main ui window
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
