import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
} from "sequelize";
import { RestauranteSeq } from "./Restaurante";

export class MesaSeq extends Model<
    InferAttributes<MesaSeq>,
    InferCreationAttributes<MesaSeq>
> {
    declare restaurante: ForeignKey<RestauranteSeq["id"]>;
    declare nombre: string;
    declare posX: number;
    declare posY: number;
    declare planta: number;
    declare capacidad: number;
    declare id: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        MesaSeq.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    key: "id",
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                posX: {
                    type: DataTypes.INTEGER,
                    key: "posx",
                    allowNull: false,
                },
                posY: {
                    type: DataTypes.INTEGER,
                    key: "posy",
                    allowNull: false,
                },
                planta: {
                    type: DataTypes.INTEGER,
                    key: "planta",
                    allowNull: false,
                    defaultValue: 1,
                },
                capacidad: {
                    type: DataTypes.INTEGER,
                    key: "capacidad",
                    allowNull: false,
                },
                nombre: {
                    type: DataTypes.STRING,
                    key: "nombre",
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
            },
            { sequelize: connection, tableName: "Mesa" }
        );
    }
}
