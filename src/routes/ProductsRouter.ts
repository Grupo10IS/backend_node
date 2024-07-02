import express, { Router } from "express";
import { ProductController } from "../controllers/ProductController";

export function NewProductRouter(): Router {
    const catRouter: Router = express.Router();
    catRouter
        /**
         * @swagger
         * components:
         *   schemas:
         *     Product:
         *       type: object
         *       properties:
         *         id:
         *           type: integer
         *           description: ID del producto 
         *         name:
         *           type: string
         *           description: Nombre del producto
         *         categoria:
         *           type: string
         *           description: Categoría del producto
         *         precio:
         *           type: number
         *           description: Precio del producto
         *

         */

        /**
         * @swagger
         * /api/productos:
         *   get:
         *     tags: [Productos]
         *     summary: Obtiene todos los productos
         *     responses:
         *       200:
         *         description: Lista de productos obtenida exitosamente
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: integer
         *                   name:
         *                     type: string
         *                   categoria:
         *                     type: string
         *                   precio:
         *                     type: number
         *       500:
         *         description: Error al procesar la solicitud
         */
        .get("/", async function (req, res, next) {
            const list = await ProductController.listAll();
            res.status(200).send(list);
            return;
        })

        .get("/:id", async function (req, res, next) {
            if (isNaN(parseInt(req.params.id))) {
                res.status(404).send();
                return;
            }

            const prod = await ProductController.getById(
                parseInt(req.params.id)
            );

            if (prod == null) {
                res.status(404).send();
                return;
            }

            res.status(200).send(prod);
        })

        /**
         * @swagger
         * /api/productos:
         *   post:
         *     tags: [Productos]
         *     summary: Crea un nuevo producto
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 description: Nombre del producto
         *               categoria:
         *                 type: string
         *                 description: Categoría del producto
         *               precio:
         *                 type: number
         *                 description: Precio del producto
         *     responses:
         *       200:
         *         description: Producto creado exitosamente
         *       400:
         *         description: Error al agregar el producto (campos faltantes)
         *       403:
         *         description: Conflicto al agregar el producto (producto ya existe)
         *       500:
         *         description: Error al procesar la solicitud
         */
        .post("/", async function (req, res, next) {
            const rest = req.body;
            // hacer la comprobacion de campos vacios
            if (!rest.categoria || !rest.precio || !rest.name) {
                res.status(400).send(
                    "Se debe proporcionar el nombre y la direccion"
                );
                return;
            }

            ProductController.add(rest)
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(403).send(err.message);
                    console.log(err);
                });
        })
        /**
         * @swagger
         * /api/productos:
         *   put:
         *     tags: [Productos]
         *     summary: Actualiza un producto existente
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: integer
         *                 description: ID del producto a actualizar
         *               name:
         *                 type: string
         *                 description: Nuevo nombre del producto
         *               categoria:
         *                 type: string
         *                 description: Nueva categoría del producto
         *               precio:
         *                 type: number
         *                 description: Nuevo precio del producto
         *     responses:
         *       200:
         *         description: Producto actualizado exitosamente
         *       400:
         *         description: Error al actualizar el producto (ID faltante)
         *       404:
         *         description: Producto no encontrado
         *       500:
         *         description: Error al procesar la solicitud
         */
        .put("/", async function (req, res, next) {
            const rest = req.body;

            if (!rest.id || rest.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            ProductController.update(rest.id, rest);
            res.status(200).send();
        })
        /**
         * @swagger
         * /api/productos:
         *   delete:
         *     tags : [Productos]
         *     summary: Elimina un producto existente
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: integer
         *                 description: ID del producto a eliminar
         *     responses:
         *       200:
         *         description: Producto eliminado exitosamente
         *       400:
         *         description: Error al eliminar el producto (ID faltante)
         *       404:
         *         description: Producto no encontrado
         *       500:
         *         description: Error al procesar la solicitud
         */
        .delete("/", async function (req, res, next) {
            const rest = req.body;
            if (!rest.id || rest.id === undefined) {
                res.status(400).send("Se debe proporcionar el ID");
                return;
            }

            ProductController.delete(rest.id);
            res.status(200).send();
        });

    return catRouter;
}
