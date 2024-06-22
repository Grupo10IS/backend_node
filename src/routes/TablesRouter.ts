import express, { Router } from "express";
import { RestaurantController } from "../controllers/RestaurantController";
import { TableController } from "../controllers/TableController";

export function NewRestaurantRouter(): Router {
    const tablesRouter: Router = express.Router({mergeParams: true});
    tablesRouter.get("/", async function (req, res, next) {
        const id = req.params.id;
        res.status(200).send(`buscando en la mesa del restaurante ${id}`);
    });

    return tablesRouter;
}
