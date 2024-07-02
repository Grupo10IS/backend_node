// Modelo para las referencias de productos
import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";

export class DetalleConsumo extends Model<
    InferAttributes<DetalleConsumo>,
    InferCreationAttributes<DetalleConsumo>
> {
    declare id: CreationOptional<number>;
    declare consumo: number;
    declare producto: number;
    declare cantidad: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        DetalleConsumo.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                consumo: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                producto: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                cantidad: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
            },
            {
                sequelize: connection,
            }
        );
    }
}
