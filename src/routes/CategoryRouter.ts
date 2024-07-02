import express, { Router } from "express";
import { CategoryController } from "../controllers/CategoriaController";

export function NewCategoryRouter(): Router {
    const catRouter: Router = express.Router();
    catRouter
        /**
         * @swagger
         * /api/categoria:
         *   get:
         *     tags: [Categoria]
         *     summary: Obtiene todas las categorías
         *     responses:
         *       200:
         *         description: Lista de categorías obtenida exitosamente
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: integer
         *                   descripcion:
         *                     type: string
         *       500:
         *         description: Error al procesar la solicitud
         */
        
        /**
         * @swagger
         * components:
         *   schemas:
         *     Category:
         *       type: object
         *       required:
         *         - id
         *         - descripcion
         *       properties:
         *         id:
         *           type: integer
         *           description: ID de la categoría
         *         descripcion:
         *           type: string
         *           description: Descripción de la categoría
         */
        .get("/", async function (req, res, next) {
            const list = await CategoryController.listAll();
            res.status(200).send(list);
            return;
        })
        /**
         * @swagger
         * /api/categoria:
         *   post:
         *     tags: [Categoria]
         *     summary: Crea una nueva categoría
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               descripcion:
         *                 type: string
         *                 description: Descripción de la categoría
         *     responses:
         *       200:
         *         description: Categoría creada exitosamente
         *       400:
         *         description: Error al agregar la categoría (campos faltantes)
         *       409:
         *         description: Conflicto al agregar la categoría (categoría ya existe)
         *       500:
         *         description: Error al procesar la solicitud
         */
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
        /**
         * @swagger
         * /api/categoria:
         *   put:
         *     tags: [Categoria]
         *     summary: Actualiza una categoría existente
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: integer
         *                 description: ID de la categoría a actualizar
         *               descripcion:
         *                 type: string
         *                 description: Nueva descripción de la categoría
         *     responses:
         *       200:
         *         description: Categoría actualizada exitosamente
         *       400:
         *         description: Error al actualizar la categoría (ID faltante)
         *       404:
         *         description: Categoría no encontrada
         *       500:
         *         description: Error al procesar la solicitud
         */
        .put("/", async function (req, res, next) {
            const rest = req.body;

            if (!rest.id) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            CategoryController.update(rest.id, rest);
            res.status(200).send();
        })
        /**
         * @swagger
         * /api/categoria:
         *   delete:
         *     tags: [Categoria]
         *     summary: Elimina una categoría existente
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: integer
         *                 description: ID de la categoría a eliminar
         *     responses:
         *       200:
         *         description: Categoría eliminada exitosamente
         *       400:
         *         description: Error al eliminar la categoría (ID faltante)
         *       404:
         *         description: Categoría no encontrada
         *       500:
         *         description: Error al procesar la solicitud
         */
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
