import express, { Router } from "express";
import Cliente from "../models/Cliente";
const clientRouter: Router = express.Router();

clientRouter
    .get("/", async function (req, res, next) {
        const user = await Cliente.findAll();
        res.send(user);
    })

    .post("/", async function (req, res, next) {
        // await Cliente.bulkCreate([
        //     { apellido: "Jack Sparrow" },
        //     { apellido: "Davy Jones" },
        // ]);
        res.status(200).send();
    });

export default clientRouter;
