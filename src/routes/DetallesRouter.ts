import express, { Router } from "express";
import { ConsumoController } from "../controllers/ConsumoController";

export function NewDetalleRouter(): Router {
    const detalleRouter: Router = express.Router();
    /**
     * @swagger
     * /api/detalles:
     *   post:
     *     summary: Agregar detalle de consumo
     *     tags:
     *       - Detalle
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               prodId:
     *                 type: integer
     *                 description: ID del producto
     *               cantidad:
     *                 type: integer
     *                 description: Cantidad del producto
     *               consId:
     *                 type: integer
     *                 description: ID del consumo
     *     responses:
     *       200:
     *         description: Detalle agregado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Detalle'
     *       400:
     *         description: Error al agregar el detalle */
    detalleRouter.post("/", async (req, res) => {
        const newConsumo = req.body;
        if (
            newConsumo.prodId == undefined ||
            newConsumo.cantidad == undefined ||
            newConsumo.consId == undefined
        ) {
            res.status(400).send("Faltan parametros");
            console.log(req.body);
            return;
        }

        if (
            isNaN(parseInt(newConsumo.prodId)) ||
            isNaN(parseInt(newConsumo.cantidad)) ||
            isNaN(parseInt(newConsumo.consId))
        ) {
            res.status(400).send("Parametros invalidos");
            console.log(req.body);
            return;
        }

        try {
            const consumo = await ConsumoController.addDetalle(
                parseInt(newConsumo.prodId),
                parseInt(newConsumo.cantidad),
                parseInt(newConsumo.consId)
            );
            if (consumo) {
                res.status(200).json(consumo);
            } else {
                res.status(400).send("Error al agregar el Detallet");
            }
        } catch (error) {
            res.status(400).send("Error al agregar el Detalle");
            console.log(error);
            console.log(error);
        }
    });

    /**
     * @swagger
     * /api/detalle + prodIds/{id}:
     *   get:
     *     summary: Obtener detalle de consumo por ID
     *     tags:
     *       - Detalle
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del detalle de consumo
     *     responses:
     *       200:
     *         description: Detalle de consumo encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Detalle'
     *       400:
     *         description: Error al listar el detalle
     */
    detalleRouter.get("/:id", async (req, res) => {
        try {
            const consumo = await ConsumoController.getDetalleConsumo(
                parseInt(req.params.id)
            );
            if (consumo) {
                res.status(200).json(consumo);
            } else {
                res.status(400).send("Error al listar el Detalle");
            }
        } catch (error) {
            res.status(400).send("Error al listar el Detalle");
            console.log(error);
        }
    });

    return detalleRouter;
}
