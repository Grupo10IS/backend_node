import express, { Router } from "express";
import User from "./models/User";
const router: Router = express.Router();

router.get("/", async function (req, res, next) {
    const user = await User.findAll();
    res.send(user);
});

router.get("/algo", async function (req, res, next) {
    await User.bulkCreate([
        { lastName: "Jack Sparrow" },
        { lastName: "Davy Jones" },
    ]);
    res.status(200).send();
});

export default router;
