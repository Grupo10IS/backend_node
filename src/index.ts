// src/index.ts
import express from "express";
import path from "path";

const app = express();
const port = 3000;

// directory for static files
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    res.send("index.html");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
