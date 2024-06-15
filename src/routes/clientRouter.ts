import express, { Router } from "express";
import { ClientController } from "../controllers/ClientController";

export function NewClientRoute(controller: ClientController): Router {
    const clientRouter: Router = express.Router();
    clientRouter
        .get("/", async function (req, res, next) {
            const id = req.query.query as string | undefined;
            if (!id || id === undefined) {
                res.send("Se debe proporcionar el id del cliente");
                return;
            }

            const user = await controller.getById(parseInt(id));
            res.send(user);
        })

        .post("/", async function (req, res, next) {
            res.status(200).send();
        });

    return clientRouter;
}
