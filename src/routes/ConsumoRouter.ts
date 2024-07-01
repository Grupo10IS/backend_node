import express, { Router } from "express";
import { ConsumoController } from "../controllers/ConsumoController";

export function NewConsumoRouter(): Router {
    const consumoRouter: Router = express.Router();
    consumoRouter
        /**
         * @openapi
         * /consumos/{id}:
         *   get:
         *     summary: Obtiene los detalles de un consumo específico por ID
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Detalles del consumo obtenidos exitosamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: integer
         *                   format: int64
         *                 mesa:
         *                   type: integer
         *                   format: int64
         *                 cliente:
         *                   type: integer
         *                   format: int64
         *                 pagado:
         *                   type: boolean
         *                 fecha_apertura:
         *                   type: string
         *                   format: date-time
         *                 fecha_cierre:
         *                   type: string
         *                   format: date-time
         *       404:
         *         description: Consumo no encontrado
         *       400:
         *         description: Error al procesar la solicitud
         */
        .get("/:id", async (req, res) => {
            try {
                const consumos = await ConsumoController.getConsumoByMesa(
                    parseInt(req.params.id)
                );

                if (consumos == null) {
                    res.status(404).send();
                    return;
                }

                res.status(200).json(consumos);
            } catch (error) {
                res.status(400).send();
            }
        })

        /**
         * @openapi
         * /consumos:
         *   post:
         *     summary: Crea un nuevo consumo
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               mesa:
         *                 type: integer
         *                 format: int64
         *                 description: ID de la mesa donde se realiza el consumo
         *               cliente:
         *                 type: integer
         *                 format: int64
         *                 description: ID del cliente asociado al consumo
         *     responses:
         *       200:
         *         description: Consumo creado exitosamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: integer
         *                   format: int64
         *                 mesa:
         *                   type: integer
         *                   format: int64
         *                 cliente:
         *                   type: integer
         *                   format: int64
         *                 pagado:
         *                   type: boolean
         *                 fecha_apertura:
         *                   type: string
         *                   format: date-time
         *                 fecha_cierre:
         *                   type: string
         *                   format: date-time
         *       400:
         *         description: Error al agregar el consumo (parámetros inválidos o faltantes)
         */
        .post("/", async (req, res) => {
            const newConsumo = req.body;
            if (
                newConsumo.mesa == undefined ||
                newConsumo.cliente == undefined
            ) {
                res.status(400).send("Error al agregar el consumo");
                return;
            }

            if (
                isNaN(parseInt(newConsumo.mesa)) ||
                isNaN(parseInt(newConsumo.cliente))
            ) {
                res.status(400).send("Error al agregar el consumo");
                return;
            }

            try {
                const consumo = await ConsumoController.newConsumision(
                    parseInt(newConsumo.cliente),
                    parseInt(newConsumo.mesa)
                );
                if (consumo) {
                    res.status(200).json(consumo);
                } else {
                    res.status(400).send("Error al agregar el consumo");
                }
            } catch (error) {
                res.status(400).send("Error al agregar el consumo");
            }
        })

        /**
         * @swagger
         * /consumos/{mesa}:
         *   put:
         *     summary: Cambia el cliente asociado a un consumo existente
         *     parameters:
         *       - name: mesa
         *         in: path
         *         required: true
         *         schema:
         *           type: integer
         *           format: int64
         *         description: ID de la mesa asociada al consumo
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               cliente:
         *                 type: integer
         *                 format: int64
         *                 description: Nuevo ID del cliente asociado al consumo
         *     responses:
         *       200:
         *         description: Cliente cambiado exitosamente
         *         content:
         *           text/plain:
         *             schema:
         *               type: string
         *       400:
         *         description: Solicitud inválida (falta el campo cliente o el valor no es válido)
         *       409:
         *         description: No se puede cambiar el cliente del consumo (posible conflicto de negocio)
         */
        .put("/:mesa", async (req, res) => {
            try {
                const mesa = parseInt(req.params.mesa);
                if (isNaN(mesa)) {
                    res.status(404).send();
                    return;
                }
            } catch (error) {
                res.status(404).send();
                return;
            }

            try {
                if (!req.body.cliente) {
                    res.status(400).send("Invalid request");
                    return;
                }

                if (isNaN(parseInt(req.body.cliente))) {
                    res.status(400).send();
                    return;
                }
            } catch (error) {
                res.status(400).send("Invalid request");
                return;
            }

            try {
                await ConsumoController.changeClient(
                    parseInt(req.params.mesa),
                    parseInt(req.body.cliente)
                );
                res.status(200).send("Consumo actualizado correctamente");
            } catch (error) {
                res.status(409).send(
                    "No se puede cambiar el cliente del consumo"
                );
                console.log(error);
            }
        })

        /**
         * @openapi
         * /consumos/{id}:
         *   delete:
         *     summary: Paga un consumo existente
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         schema:
         *           type: integer
         *           format: int64
         *         description: ID del consumo a pagar
         *     responses:
         *       200:
         *         description: Consumo pagado exitosamente
         *         content:
         *           text/plain:
         *             schema:
         *               type: string
         *       400:
         *         description: Error al pagar el consumo
         */
        .delete("/:id", async (req, res) => {
            const id = parseInt(req.params.id);
            try {
                await ConsumoController.pagar(id);
                res.status(200).send("Consumo actualizado correctamente");
            } catch (error) {
                res.status(400).send("Error al actualizar el consumo");
            }
        });

    return consumoRouter;
}
