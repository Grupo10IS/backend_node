import express, { Router } from "express";
import { ProductController } from "../controllers/ProductController";

export function NewProductRouter(): Router {
    const catRouter: Router = express.Router();
    catRouter
        .get("/", async function (req, res, next) {
            const list = await ProductController.listAll();
            res.status(200).send(list);
            return;
        })

        .post("/", async function (req, res, next) {
            const rest = req.body;
            // hacer la comprobacion de campos vacios
            if (!rest.categoria || !rest.precio || !rest.name) {
                res.status(400).send(
                    "Se debe proporcionar el nombre y la direccion"
                );
                return;
            }

            ProductController.add(rest)
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(403).send(err.message);
                });
        })

        .put("/", async function (req, res, next) {
            const rest = req.body;

            if (!rest.id || rest.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            ProductController.update(rest.id, rest);
            res.status(200).send();
        })

        .delete("/", async function (req, res, next) {
            const rest = req.body;
            if (!rest.id || rest.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            ProductController.delete(rest.id);
            res.status(200).send();
        });

    return catRouter;
}
