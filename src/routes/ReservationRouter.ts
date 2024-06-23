import express, { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";

export function NewReservationRouter(): Router {
    const reservationRouter: Router = express.Router();
    reservationRouter
        .get("/", async function (req, res, next) {
            try {
                const list = await ReservationController.listReservations({
                    resId: req.query.resId as string | undefined,
                    client: req.query.client as string | undefined,
                    date: req.query.date as string | undefined,
                });
                res.status(200).send(list);
                return;
            } catch (error) {
                res.status(400).send("Bad request format");
                console.log(error);
            }
        })

        .post("/", async function (req, res, next) {
            const body = req.body;
            // hacer la comprobacion de campos vacios
            if (
                !body.clientDni ||
                !body.tableId ||
                !body.date ||
                !body.reservationStart ||
                !body.reservationEnd
            ) {
                res.status(400).send(
                    "Se debe proporcionar el nombre, el id del restaurante, la posición X, la posición Y, el piso y la capacidad"
                );
                return;
            }

            ReservationController.makeReservation(
                parseInt(body.clientDni),
                parseInt(body.tableId),
                new Date(body.date),
                parseInt(body.reservationStart),
                parseInt(body.reservationEnd)
            )
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(409).send("No se puede realizar la reservacion");
                    console.log(err);
                });
        })

        .delete("/", async function (req, res, next) {
            if (!req.body.id || req.body.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            ReservationController.cancelReservation(req.body.id);
            res.status(200).send();
        });

    return reservationRouter;
}
