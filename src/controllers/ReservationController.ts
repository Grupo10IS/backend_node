import { Op } from "sequelize";
import { Reservation } from "../db/Reservation";

import { Table } from "../db/Table";
import { Client } from "../db/Client";

type filters = {
    date?: string;
    client?: string;
    resId?: string;
};

export class ReservationController {
    static async listReservations(
        filter: filters
    ): Promise<Reservation[] | null> {
        // eslint-disable-next-line
        const where: any = {};

        if (filter.date !== undefined) {
            where.date = new Date(filter.date);
        }

        if (filter.client !== undefined) {
            where.client = parseInt(filter.client);
        }

        if (filter.resId !== undefined) {
            where.resId = parseInt(filter.resId);
        }

        const results = await Reservation.findAll({
            where: where,
        });

        return results;
    }

    static async listAvailableTables(
        resId: string,
        date: string,
        start: string,
        end: string
    ): Promise<Reservation[] | null> {
        const results = await Reservation.findAll({
            where: {
                date: new Date(date),
                resId: resId,
                reservation_start: { [Op.lt]: parseInt(end) },
                reservation_end: { [Op.gt]: parseInt(start) },
            },
        });

        return results;
    }

    static async makeReservation(
        clientDni: number,
        tableId: number,
        date: Date,
        reservationStart: number,
        reservationEnd: number
    ) {
        try {
            // Verificar si el cliente existe
            const client = await Client.findOne({
                where: { dni: clientDni },
            });
            if (!client) {
                throw new Error("El cliente no existe");
            }

            // Verificar si la mesa existe
            const table = await Table.findByPk(tableId);
            if (table === null) {
                throw new Error("La mesa no existe");
            }
            const restaurantId = table.resId;

            // Verificar si la mesa ya está reservada en la fecha y horario especificado
            const conflictingReservations = await Reservation.findOne({
                where: {
                    table: tableId,
                    date: date,
                    [Op.and]: [
                        {
                            reservation_start: {
                                [Op.lt]: reservationEnd, // A empieza antes de que B termine
                            },
                        },
                        {
                            reservation_end: {
                                [Op.gt]: reservationStart, // A termina después de que B empiece
                            },
                        },
                    ],
                },
            });

            if (conflictingReservations !== null) {
                // Manejar el caso en el que haya conflicto de reservas
                throw new Error(
                    "La mesa ya está reservada en el horario especificado."
                );
            }

            // Crear la reservación
            const reservation = await Reservation.create({
                table: tableId,
                client: clientDni,
                resId: restaurantId,
                date: date,
                reservation_start: reservationStart,
                reservation_end: reservationEnd,
            });

            return reservation;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async cancelReservation(id: number) {
        const reservation = await Reservation.findByPk(id);
        if (reservation === null) {
            throw new Error("La reservacion no existe");
        }

        await Reservation.destroy({ where: { id: id } });
    }
}
