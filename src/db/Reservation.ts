import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    CreationOptional,
    Op,
} from "sequelize";
import { Table } from "./Table";
import { Client } from "./Client";
import { Restaurant } from "./Restaurant";

export class Reservation extends Model<
    InferAttributes<Reservation>,
    InferCreationAttributes<Reservation>
> {
    declare table: ForeignKey<Table["id"]>;
    declare resId: ForeignKey<Restaurant["id"]>;
    declare client: ForeignKey<Client["dni"]>;
    declare date: Date;
    declare reservation_start: number;
    declare reservation_end: number;
    declare id: CreationOptional<number>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Reservation.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                reservation_start: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 12,
                        max: 23,
                    },
                },
                reservation_end: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 12,
                        max: 23,
                    },
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                table: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                client: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                resId: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
            },
            { sequelize: connection }
        );
    }

    static async tablesWithoutReservations(
        resId: string,
        date: string,
        start: string,
        end: string,
        capacity: string,
    ): Promise<Table[]> {
        // Primero, encontramos las reservas que se solapan con el rango de tiempo dado y que pertenecen al restaurante especificado
        const overlappingReservations =
            await Reservation.findAll({
                attributes: ["table"],
                where: {
                    [Op.and]: [
                        {
                            table: {
                                [Op.in]: [resId],
                            },
                        },
                        {
                            date: {
                                [Op.eq]: new Date(date),
                            },
                        },
                        {
                            reservation_start: {
                                [Op.lte]: parseInt(start),
                            },
                        },
                        {
                            reservation_end: {
                                [Op.gte]: parseInt(end),
                            },
                        },
                    ],
                },
                raw: true,
            });

        // Extraer los IDs de las tablas reservadas
        const reservedTableIds = overlappingReservations.map(
            // eslint-disable-next-line
            // @ts-ignore
            (res) => res.table
        );

        // Ahora, buscamos las tablas que NO están en la lista de reservas y que pertenecen al restaurante especificado
        return (await Table.findAll({
            where: {
                [Op.and]: [
                    {
                        id: {
                            [Op.notIn]: reservedTableIds,
                        },
                    },
                    {
                        resId: {
                            [Op.eq]: parseInt(resId),
                        },
                    },
                    {
                        capacity: {
                            [Op.gte]: parseInt(capacity),
                        },
                    },
                ],
            },
        })) as Table[];
    }
}
