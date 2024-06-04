import express, { Router } from "express";
import User from "./models/User";
const router: Router = express.Router();

router.get("/", async function (req, res, next) {
    const user = await User.findAll();
    res.send(user[0]);
});

export default router;
