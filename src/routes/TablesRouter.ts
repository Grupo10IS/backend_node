import express, { Router } from "express";
import { TableController } from "../controllers/TableController";

export function NewTablesRouter(): Router {
    const tablesRouter: Router = express.Router();
    tablesRouter
        .get("/", async function (req, res, next) {
            try {
                const list = await TableController.listAll({
                    resId: req.query.resId as string | undefined,
                    floor: req.query.floor as string | undefined,
                    capacity: req.query.capacity as string | undefined,
                });
                res.status(200).send(list);
                return;
            } catch (error) {
                res.status(400).send("Bad request format");
                console.log(error);
            }
        })

        .get("/:id", async function (req, res, next) {
            try {
                const id = req.params.id;

                const table = await TableController.findById(parseInt(id));
                if (table === null) {
                    res.status(404).send("Table does not exists");
                    return;
                }

                res.status(200).send(table);
            } catch (error) {
                res.status(400).send("Bad request format");
            }
        })

        .post("/", async function (req, res, next) {
            const body = req.body;
            // hacer la comprobacion de campos vacios
            if (
                !body.name ||
                !body.resId ||
                !body.posX ||
                !body.posY ||
                !body.floor ||
                !body.capacity
            ) {
                res.status(400).send(
                    "Se debe proporcionar el nombre, el id del restaurante, la posición X, la posición Y, el piso y la capacidad"
                );
                return;
            }

            TableController.add(
                body.name,
                body.resId,
                body.posX,
                body.posY,
                body.floor,
                body.capacity
            )
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(409).send("Ya existe una mesa en esa posicion");
                });
        })

        .put("/", async function (req, res, next) {
            const body = req.body;

            TableController.update(
                parseInt(body.id),
                body.name,
                body.posX,
                body.posY,
                body.floor,
                body.capacity
            )
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(400).send(err.message);
                });
        })

        .delete("/", async function (req, res, next) {
            if (!req.body.id || req.body.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            TableController.delete(req.body.id);
            res.status(200).send();
        });

    return tablesRouter;
}
