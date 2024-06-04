// src/index.ts
import express from "express";
import path from "path";
import { initDb } from "./db";
import router from "./router";

const app = express();
const port = 3000;

initDb("sqlite:memmory:");

// directory for static files
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api", router)

// main with ui
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
