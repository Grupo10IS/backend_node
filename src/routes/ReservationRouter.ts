import express, { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";

export function NewReservationRouter(): Router {
    const reservationRouter: Router = express.Router();
    reservationRouter
        /**
         * @swagger
         * /api/reservations:
         *   get:
         *     summary: Obtener lista de reservas
         *     description: Retorna una lista de reservas filtrada opcionalmente por ID de restaurante, cliente y fecha.
         *     tags: [Reservations]
         *     parameters:
         *       - in: query
         *         name: resId
         *         schema:
         *           type: string
         *         description: ID del restaurante
         *       - in: query
         *         name: client
         *         schema:
         *           type: string
         *         description: ID del cliente
         *       - in: query
         *         name: date
         *         schema:
         *           type: string
         *           format: date
         *         description: Fecha de la reserva
         *     responses:
         *       200:
         *         description: Lista de reservas encontradas
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Reservation'
         *       400:
         *         description: Error en el formato de la solicitud
         */

        /**
         * @swagger
         * components:
         *   schemas:
         *     Reservation:
         *       type: object
         *       required:
         *         - id
         *         - resId
         *         - client
         *         - date
         *         - reservation_start
         *         - reservation_end
         *         - table
         *       properties:
         *         id:
         *           type: integer
         *           description: ID auto-generado de la reserva
         *         resId:
         *           type: integer
         *           description: ID del restaurante
         *         client:
         *           type: integer
         *           description: ID del cliente
         *         date:
         *           type: string
         *           format: date
         *           description: Fecha de la reserva
         *         reservation_start:
         *           type: integer
         *           description: Hora de inicio de la reserva (en formato de 24 horas)
         *         reservation_end:
         *           type: integer
         *           description: Hora de fin de la reserva (en formato de 24 horas)
         *         table:
         *           type: integer
         *           description: ID de la mesa reservada
         */
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

        /**
         * @swagger
         * /api/reservations:
         *   post:
         *     summary: Crear nueva reserva
         *     description: Crea una nueva reserva con los detalles proporcionados.
         *     tags: [Reservations]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - clientDni
         *               - tableId
         *               - date
         *               - reservationStart
         *               - reservationEnd
         *             properties:
         *               clientDni:
         *                 type: integer
         *                 description: DNI del cliente
         *               tableId:
         *                 type: integer
         *                 description: ID de la mesa reservada
         *               date:
         *                 type: string
         *                 format: date
         *                 description: Fecha de la reserva
         *               reservationStart:
         *                 type: integer
         *                 description: Hora de inicio de la reserva (en formato de 24 horas)
         *               reservationEnd:
         *                 type: integer
         *                 description: Hora de fin de la reserva (en formato de 24 horas)
         *     responses:
         *       200:
         *         description: Reserva creada exitosamente
         *       400:
         *         description: Error en el formato de la solicitud o campos faltantes
         *       409:
         *         description: No se puede realizar la reservación
         */
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

        /**
         * @swagger
         * /api/reservations:
         *   delete:
         *     summary: Cancelar una reserva
         *     description: Cancela una reserva existente basada en su ID.
         *     tags: [Reservations]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - id
         *             properties:
         *               id:
         *                 type: integer
         *                 description: ID de la reserva a cancelar
         *     responses:
         *       200:
         *         description: Reserva cancelada exitosamente
         *       400:
         *         description: Error en el formato de la solicitud o ID faltante
         */
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
