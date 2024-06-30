import express, { Router } from "express";
import { CategoryController } from "../controllers/CategoriaController";

export function NewCategoryRouter(): Router {
    const catRouter: Router = express.Router();
    catRouter
        .get("/", async function (req, res, next) {
            const list = await CategoryController.listAll();
            res.status(200).send(list);
            return;
        })

        .post("/", async function (req, res, next) {
            const rest = req.body;
            // hacer la comprobacion de campos vacios
            if (!rest.descripcion) {
                res.status(400).send(
                    "Se debe proporcionar el nombre y la direccion"
                );
                return;
            }

            CategoryController.add(rest)
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(409).send(err.message);
                });
        })

        .put("/", async function (req, res, next) {
            const rest = req.body;

            if (!rest.id) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            CategoryController.update(rest.id, rest);
            res.status(200).send();
        })

        .delete("/", async function (req, res, next) {
            const rest = req.body;
            if (!rest.id || rest.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            CategoryController.delete(rest.id);
            res.status(200).send();
        });

    return catRouter;
}
