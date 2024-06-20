import express, { Router } from "express";
import { ClientController } from "../controllers/ClientController";

export function NewClientRouter(): Router {
    const clientRouter: Router = express.Router();
    clientRouter
        /**
         * @swagger
         * components:
         *   schemas:
         *     Client:
         *       type: object
         *       required:
         *         - id
         *         - dni
         *         - firstName
         *         - lastName
         *       properties:
         *         id:
         *           type: number
         *           description: ID auto-generado del cliente
         *         firstName:
         *           type: string
         *           description: Nombre del cliente
         *         lastName:
         *           type: string
         *           description: Apellido del cliente
         *         dni:
         *           type: number
         *           description: DNI del cliente
         */

        /**
         * @swagger
         * tags:
         *   name: Clients
         *   description: API para gestionar clientes
         */

        /**
         * @swagger
         * /api/client:
         *   get:
         *     summary: Obtiene un cliente por cédula
         *     tags: [Clients]
         *     parameters:
         *       - in: query
         *         name: dni
         *         schema:
         *           type: string
         *         required: true
         *         description: La cédula del cliente
         *     responses:
         *       200:
         *         description: Cliente encontrado
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Client'
         *       204:
         *         description: Cliente no registrado
         *       400:
         *         description: Se debe proporcionar la cédula del cliente
         */
        .get("/", async function (req, res, next) {
            const dni = req.query.dni as string | undefined;
            if (dni === undefined) {
                res.status(400).send("Se debe proporcionar el id del cliente");
                return;
            }

            const user = await ClientController.getById(parseInt(dni));
            if (null == user) {
                res.status(204).send("Cliente no registrado");
                return;
            }

            res.status(200).send(JSON.stringify(user));
        })

        /**
         * @swagger
         * components:
         *   schemas:
         *     Client:
         *       type: object
         *       required:
         *         - firstName
         *         - lastName
         *         - dni
         *       properties:
         *         firstName:
         *           type: string
         *           description: Nombre del cliente
         *         lastName:
         *           type: string
         *           description: Apellido del cliente
         *         dni:
         *           type: number
         *           description: DNI del cliente
         */

        /**
         * @swagger
         * tags:
         *   name: Clients
         *   description: API para gestionar clientes
         */
        /**

         * @swagger
         * /api/client:
         *   post:
         *     summary: Añade un nuevo cliente
         *     tags: [Clients]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Client'
         *     responses:
         *       200:
         *         description: Cliente añadido correctamente
         *       400:
         *         description: Se debe proporcionar el nombre, el apellido y el dni
         *       409:
         *         description: El cliente ya existe
         */
        .post("/", async function (req, res, next) {
            const client = req.body;
            if (!client.firstName || !client.lastName || !client.dni) {
                res.status(400).send(
                    "Se debe proporcionar el nombre, el apellido y el dni"
                );
                return;
            }

            ClientController.add(client.firstName, client.lastName, client.dni)
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(409).send(err.message);
                });
        });

    return clientRouter;
}
