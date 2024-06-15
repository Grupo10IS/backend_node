// src/index.ts
import express from "express";
import path from "path";

import { Sequelize } from "sequelize";

// models
import { ClienteSeq } from "./models/Cliente";
import { MesaSeq } from "./models/Mesa";
import { ReservaSeq } from "./models/Reserva";
import { RestauranteSeq } from "./models/Restaurante";

// routers
import { NewClientRoute } from "./routes/clientRouter";
import { ClientController } from "./controllers/ClientController";

const app = express();
const port = 3000;

// -----------------
// | connect to db |
// -----------------
const db_uri = "sqlite::memmory:";
const connection = new Sequelize(db_uri);

// configure our sequelize models
ClienteSeq.configure(connection);
MesaSeq.configure(connection);
ReservaSeq.configure(connection);
RestauranteSeq.configure(connection);

connection.sync().then();
connection.authenticate();

//  ----------------
// | express config |
//  ----------------
// directory for static files
app.use(express.static(path.join(__dirname, "../public")));

// routes TODO: anadir mas rutas
const clientController = new ClientController(new ClienteSeq());
app.use("/api/client", NewClientRoute(clientController));

// main ui window
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
