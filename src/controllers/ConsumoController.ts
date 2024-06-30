import { Op } from "sequelize";
import { Consumo } from "../db/Consumo";
import { DetalleConsumo } from "../db/DetalleConsumo";
import { ClientController } from "./ClientController";

export class ConsumoController {
    static async getConsumoByMesa(mesaId: number): Promise<Consumo | null> {
        const res = await Consumo.findOne({
            where: { [Op.and]: [{ mesa: mesaId }, { pagado: false }] },
            include: [
                {
                    model: DetalleConsumo,
                    as: "detalles",
                },
            ],
        });

        return res;
    }

    static async pagar(id: number) {
        await Consumo.update({ pagado: true }, { where: { id: id } });
    }

    static async addDetalle(
        prodId: number,
        cantidad: number,
        consId: number
    ): Promise<DetalleConsumo | null> {
        try {
            const con = await Consumo.findByPk(consId);
            if (con == null) {
                throw "No existe consumision con ID";
            }

            if (con.pagado) {
                throw "La consumision ya se encuetra cerrada";
            }

            return await DetalleConsumo.create({
                consumo: consId,
                cantidad: cantidad,
                producto: prodId,
            });
        } catch (error) {
            return null;
        }
    }

    static async newConsumision(
        cliente: number,
        mesa: number
    ): Promise<Consumo | null> {
        try {
            const con = await ConsumoController.getConsumoByMesa(mesa);
            if (con !== null) {
                throw "Mesa ya tiene consumision";
            }

            if (await ClientController.getById(cliente) == null) {
                throw "Cliente no existe";
            }

            if (await ClientController.getById(mesa) == null) {
                throw "Mesa no existe";
            }

            return await Consumo.create({
                cliente: cliente,
                mesa: mesa,
            });
        } catch (error) {
            return null;
        }
    }

    static async changeClient(mesa: number, newClient: number) {
        // ver que el cliente exista
        const client = await ClientController.getById(newClient);
        if (client == null) {
            throw "Cliente no existe";
        }

        const consumo = await ConsumoController.getConsumoByMesa(mesa);
        if (consumo == null) {
            throw "Mesa no contiene consumision";
        }

        consumo.update({ cliente: newClient });
        await consumo.save();
    }
}
