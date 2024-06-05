// src/index.ts
import express from "express";
import path from "path";

import { Sequelize } from "sequelize";

// models
import User from "./models/User";
import clientRouter from "./routes/clientRouter";

const app = express();
const port = 3000;

// -----------------
// | connect to db |
// -----------------
const connection = new Sequelize("sqlite:memmory:");

// configure our models
User.configure(connection);

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
