// Modelo para las referencias de productos
import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    CreationOptional,
} from "sequelize";
import { Consumo } from "./Consumo";
import { Product } from "./Producto";

export class DetalleConsumo extends Model<
    InferAttributes<DetalleConsumo>,
    InferCreationAttributes<DetalleConsumo>
> {
    declare id: CreationOptional<number>;
    declare consumo: ForeignKey<Consumo["id"]>;
    declare producto: ForeignKey<Product["id"]>;
    declare cantidad: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        DetalleConsumo.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                consumo: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                producto: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                cantidad: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
            },
            {
                sequelize: connection,
                // don't generate an "updatedAt" attribute
                createdAt: false,
                updatedAt: false,
            }
        );
    }
}
