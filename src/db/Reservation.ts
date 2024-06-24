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
    declare client: ForeignKey<Client["id"]>;
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
        connection: Sequelize
    ): Promise<Table[]> {
        // Primero, encontramos las reservas que se solapan con el rango de tiempo dado y que pertenecen al restaurante especificado
        const overlappingReservations =
            await connection.models.Reservation.findAll({
                attributes: ["table"],
                where: {
                    table: {
                        [Op.in]: [resId], // Asegurarse de que las reservas pertenecen al restaurante especificado
                    },
                    date: {
                        [Op.eq]: new Date(date),
                    },
                    reservation_start: {
                        [Op.lte]: new Date(`${date}T${end}:00`), // Rango hasta el final del rango de tiempo dado
                    },
                    reservation_end: {
                        [Op.gte]: new Date(`${date}T${start}:00`), // Rango desde el inicio del rango de tiempo dado
                    },
                },
                raw: true,
            });

        // Extraer los IDs de las tablas reservadas
        const reservedTableIds = overlappingReservations.map(
            // @ts-ignore
            (res) => res.table
        );

        // Ahora, buscamos las tablas que NO están en la lista de reservas y que pertenecen al restaurante especificado
        return (await connection.models.Table.findAll({
            attributes: ["id", "name"], // Añade aquí cualquier otro atributo que desees seleccionar
            where: {
                id: {
                    [Op.notIn]: reservedTableIds,
                },
                resId: {
                    [Op.eq]: parseInt(resId),
                },
            },
        })) as Table[];
    }
}
