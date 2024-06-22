import express, { Router } from "express";
import { RestaurantController } from "../controllers/RestaurantController";

export function NewRestaurantRouter(): Router {
    const restRouter: Router = express.Router();
    restRouter
        /**
         * @swagger
         * components:
         *   schemas:
         *     Restaurant:
         *       type: object
         *       required:
         *         - name
         *         - address
         *       properties:
         *         name:
         *           type: string
         *           description: Nombre del restaurante
         *         address:
         *           type: string
         *           description: Dirección del restaurante
         *         id:
         *           type: number
         *           description: Id del restaurante
         *         tablesInfo:
         *           type: string
         *           description: URL to fetch tables information of this restaurant
         */

        /**
         * @swagger
         * /api/restaurant:
         *   get:
         *     summary: Obtiene la lista de restaurantes disponibles con su informacion
         *     tags: [Restaurants]
         *     responses:
         *       200:
         *         description: Restaurante(s) encontrado(s)
         *         content:
         *           application/json:
         *             schema:
         *               oneOf:
         *                 - type: array
         *                   items:
         *                     $ref: '#/components/schemas/Restaurant'
         *                 - $ref: '#/components/schemas/Restaurant'
         *       204:
         *         description: No existen Restaurantes no registrados
         */
        .get("/", async function (req, res, next) {
            const list = await RestaurantController.listAll();
            res.status(200).send(list);
            return;
        })

        /**
         * @swagger
         * /api/restaurant/:id:
         *   get:
         *     summary: Obtiene la informacion del restaurante con dicho "id"
         *     tags: [Restaurants]
         *     responses:
         *       200:
         *         description: Informacion del Restaurante encontrado
         *         content:
         *           application/json:
         *             schema:
         *               oneOf:
         *                 - type: array
         *                   items:
         *                     $ref: '#/components/schemas/Restaurant'
         *                 - $ref: '#/components/schemas/Restaurant'
         *       404:
         *         description: No existen el restaurante
         *       400:
         *         description: Formato de id incorrecto
         */
        .get("/:id", async function (req, res, next) {
            try {
                const id = parseInt(req.params.id);
                const restaurant = await RestaurantController.getById(id);
                if (null == restaurant) {
                    res.status(404).send("Restaurante no registrado");
                    return;
                }
                res.status(200).send(restaurant);
            } catch (err) {
                res.status(400).send("Bad Id format");
            }
        })

        /**
         * @swagger
         * tags:
         *   name: Restaurants
         *   description: API para gestionar restaurantes
         */

        /**
         * @swagger
         * /api/restaurant:
         *   post:
         *     summary: Añade un nuevo restaurante
         *     tags: [Restaurants]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Restaurant'
         *     responses:
         *       200:
         *         description: Restaurante añadido correctamente
         *       400:
         *         description: Se debe proporcionar el nombre y la dirección del restaurante
         */
        .post("/", async function (req, res, next) {
            const rest = req.body;
            // hacer la comprobacion de campos vacios
            if (!rest.name || !rest.address) {
                res.status(400).send(
                    "Se debe proporcionar el nombre y la direccion"
                );
                return;
            }

            RestaurantController.add(rest.name, rest.address)
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(409).send(err.message);
                });
        })

        /**
         * @swagger
         * components:
         *   schemas:
         *     Restaurant:
         *       type: object
         *       required:
         *         - name
         *         - address
         *       properties:
         *         id:
         *           type: string
         *           description: ID del restaurante
         *         name:
         *           type: string
         *           description: Nuevo nombre del restaurante
         *         address:
         *           type: string
         *           description: Nueva dirección del restaurante
         *
         * @swagger
         * tags:
         *   name: Restaurants
         *   description: API para gestionar restaurantes
         *
         * @swagger
         * /api/restaurant:
         *   put:
         *     summary: Actualiza un restaurante existente
         *     tags: [Restaurants]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Restaurant'
         *     responses:
         *       200:
         *         description: Restaurante actualizado correctamente
         *       400:
         *         description: Se debe proporcionar el nombre y la dirección del restaurante
         */
        .put("/", async function (req, res, next) {
            const rest = req.body;

            if (!rest.id || !rest.name || !rest.address) {
                res.status(400).send(
                    "Se debe proporcionar el ID, el nuevo nombre y la nueva direccion"
                );
                return;
            }

            RestaurantController.update(rest.id, rest);
            res.status(200).send();
        })

        /**
         * @swagger
         * /api/restaurant:
         *   delete:
         *     summary: Elimina un restaurante por ID
         *     tags: [Restaurants]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: string
         *                 description: ID del restaurante a eliminar
         *     responses:
         *       200:
         *         description: Restaurante eliminado correctamente
         *       400:
         *         description: Se debe proporcionar el ID del restaurante
         */
        .delete("/", async function (req, res, next) {
            if (!req.body.id) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            const rest = req.body;
            RestaurantController.delete(rest.id);
            res.status(200).send();
        });

    return restRouter;
}
