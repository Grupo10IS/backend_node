import express, { Router } from "express";
import { TableController } from "../controllers/TableController";

export function NewTablesRouter(): Router {
    const tablesRouter: Router = express.Router();
    tablesRouter
        /**
         * @swagger
         * /api/tables:
         *   get:
         *     summary: Obtener lista de mesas
         *     description: Retorna una lista de mesas filtrada opcionalmente por ID de restaurante, piso y capacidad.
         *     tags: [Tables]
         *     parameters:
         *       - in: query
         *         name: resId
         *         schema:
         *           type: string
         *         description: ID del restaurante al que pertenecen las mesas
         *       - in: query
         *         name: floor
         *         schema:
         *           type: string
         *         description: Número de piso de las mesas
         *       - in: query
         *         name: capacity
         *         schema:
         *           type: string
         *         description: Capacidad mínima de las mesas
         *     responses:
         *       200:
         *         description: Lista de mesas encontradas
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Table'
         *       400:
         *         description: Error en el formato de la solicitud
         */

        /**
         * @swagger
         * components:
         *   schemas:
         *     Table:
         *       type: object
         *       required:
         *         - id
         *         - name
         *         - posX
         *         - posY
         *         - floor
         *         - capacity
         *       properties:
         *         id:
         *           type: integer
         *           description: ID auto-generado de la mesa
         *         resId:
         *           type: integer
         *           description: ID del restaurante al que pertenece la mesa
         *         name:
         *           type: string
         *           description: Nombre de la mesa
         *         posX:
         *           type: integer
         *           description: Posición X de la mesa
         *         posY:
         *           type: integer
         *           description: Posición Y de la mesa
         *         floor:
         *           type: integer
         *           description: Número de piso de la mesa
         *         capacity:
         *           type: integer
         *           description: Capacidad de la mesa
         */
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

        /**
         * @swagger
         * /api/tables/{id}:
         *   get:
         *     summary: Obtener mesa por ID
         *     description: Retorna los detalles de una mesa específica basada en su ID.
         *     tags: [Tables]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: ID de la mesa a buscar
         *     responses:
         *       200:
         *         description: Mesa encontrada
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Table'
         *       404:
         *         description: Mesa no encontrada
         *       400:
         *         description: Error en el formato de la solicitud
         */

        /**
         * @swagger
         * components:
         *   schemas:
         *     Table:
         *       type: object
         *       required:
         *         - id
         *         - name
         *         - posX
         *         - posY
         *         - floor
         *         - capacity
         *       properties:
         *         id:
         *           type: integer
         *           description: ID auto-generado de la mesa
         *         resId:
         *           type: integer
         *           description: ID del restaurante al que pertenece la mesa
         *         name:
         *           type: string
         *           description: Nombre de la mesa
         *         posX:
         *           type: integer
         *           description: Posición X de la mesa
         *         posY:
         *           type: integer
         *           description: Posición Y de la mesa
         *         floor:
         *           type: integer
         *           description: Número de piso de la mesa
         *         capacity:
         *           type: integer
         *           description: Capacidad de la mesa
         */
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

        /**
         * @swagger
         * /api/tables:
         *   post:
         *     summary: Crear nueva mesa
         *     description: Crea una nueva mesa con los detalles proporcionados.
         *     tags: [Tables]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *               - resId
         *               - posX
         *               - posY
         *               - floor
         *               - capacity
         *             properties:
         *               name:
         *                 type: string
         *                 description: Nombre de la mesa
         *               resId:
         *                 type: integer
         *                 description: ID del restaurante al que pertenece la mesa
         *               posX:
         *                 type: integer
         *                 description: Posición X de la mesa
         *               posY:
         *                 type: integer
         *                 description: Posición Y de la mesa
         *               floor:
         *                 type: integer
         *                 description: Número de piso de la mesa
         *               capacity:
         *                 type: integer
         *                 description: Capacidad de la mesa
         *     responses:
         *       200:
         *         description: Mesa creada exitosamente
         *       400:
         *         description: Error en el formato de la solicitud o campos faltantes
         *       409:
         *         description: Ya existe una mesa en esa posición
         */

        /**
         * @swagger
         * components:
         *   schemas:
         *     Table:
         *       type: object
         *       required:
         *         - id
         *         - name
         *         - posX
         *         - posY
         *         - floor
         *         - capacity
         *       properties:
         *         id:
         *           type: integer
         *           description: ID auto-generado de la mesa
         *         resId:
         *           type: integer
         *           description: ID del restaurante al que pertenece la mesa
         *         name:
         *           type: string
         *           description: Nombre de la mesa
         *         posX:
         *           type: integer
         *           description: Posición X de la mesa
         *         posY:
         *           type: integer
         *           description: Posición Y de la mesa
         *         floor:
         *           type: integer
         *           description: Número de piso de la mesa
         *         capacity:
         *           type: integer
         *           description: Capacidad de la mesa
         */
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

        /**
         * @swagger
         * /api/tables:
         *   put:
         *     summary: Actualizar mesa existente
         *     description: Actualiza los detalles de una mesa existente basada en su ID.
         *     tags: [Tables]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - id
         *               - name
         *               - posX
         *               - posY
         *               - floor
         *               - capacity
         *             properties:
         *               id:
         *                 type: integer
         *                 description: ID de la mesa a actualizar
         *               name:
         *                 type: string
         *                 description: Nuevo nombre de la mesa
         *               posX:
         *                 type: integer
         *                 description: Nueva posición X de la mesa
         *               posY:
         *                 type: integer
         *                 description: Nueva posición Y de la mesa
         *               floor:
         *                 type: integer
         *                 description: Nuevo número de piso de la mesa
         *               capacity:
         *                 type: integer
         *                 description: Nueva capacidad de la mesa
         *     responses:
         *       200:
         *         description: Mesa actualizada exitosamente
         *       400:
         *         description: Error en el formato de la solicitud o campos faltantes
         */

        /**
         * @swagger
         * components:
         *   schemas:
         *     Table:
         *       type: object
         *       required:
         *         - id
         *         - name
         *         - posX
         *         - posY
         *         - floor
         *         - capacity
         *       properties:
         *         id:
         *           type: integer
         *           description: ID auto-generado de la mesa
         *         resId:
         *           type: integer
         *           description: ID del restaurante al que pertenece la mesa
         *         name:
         *           type: string
         *           description: Nombre de la mesa
         *         posX:
         *           type: integer
         *           description: Posición X de la mesa
         *         posY:
         *           type: integer
         *           description: Posición Y de la mesa
         *         floor:
         *           type: integer
         *           description: Número de piso de la mesa
         *         capacity:
         *           type: integer
         *           description: Capacidad de la mesa
         */
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

        /**
         * @swagger
         * /api/tables:
         *   delete:
         *     summary: Eliminar mesa por ID
         *     description: Elimina una mesa existente basada en su ID.
         *     tags: [Tables]
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
         *                 description: ID de la mesa a eliminar
         *     responses:
         *       200:
         *         description: Mesa eliminada exitosamente
         *       400:
         *         description: Error en el formato de la solicitud o ID faltante
         */

        /**
         * @swagger
         * components:
         *   schemas:
         *     Table:
         *       type: object
         *       required:
         *         - id
         *         - name
         *         - posX
         *         - posY
         *         - floor
         *         - capacity
         *       properties:
         *         id:
         *           type: integer
         *           description: ID auto-generado de la mesa
         *         resId:
         *           type: integer
         *           description: ID del restaurante al que pertenece la mesa
         *         name:
         *           type: string
         *           description: Nombre de la mesa
         *         posX:
         *           type: integer
         *           description: Posición X de la mesa
         *         posY:
         *           type: integer
         *           description: Posición Y de la mesa
         *         floor:
         *           type: integer
         *           description: Número de piso de la mesa
         *         capacity:
         *           type: integer
         *           description: Capacidad de la mesa
         */
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
