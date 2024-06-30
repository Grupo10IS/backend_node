import express, { Router } from "express";
import { ConsumoController } from "../controllers/ConsumoController";

export function NewConsumoRouter(): Router {
    const consumoRouter: Router = express.Router();

    consumoRouter
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

        // pagar un consumo
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
