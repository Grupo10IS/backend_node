import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    CreationOptional,
} from "sequelize";
import { Table } from "./Table";
import { Client } from "./Client";

export class Reservation extends Model<
    InferAttributes<Reservation>,
    InferCreationAttributes<Reservation>
> {
    declare table: ForeignKey<Table["id"]>;
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
            },
            { sequelize: connection }
        );
    }
}
