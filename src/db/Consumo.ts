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
import { Categoria } from "./Categoria";
import { Client } from "./Client";
import { DetalleConsumo } from "./DetalleConsumo";

export class Consumo extends Model<
    InferAttributes<Consumo>,
    InferCreationAttributes<Consumo>
> {
    declare id: CreationOptional<number>;
    declare mesa: ForeignKey<Categoria["id"]>;
    declare cliente: ForeignKey<Client["dni"]>;
    declare pagado: CreationOptional<boolean>; // true es "libre", false es "con consumision" (cargado automaticamente)

    declare fecha_apertura: CreationOptional<Date>; // cargado automaticamente
    declare fecha_cierre: CreationOptional<Date>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Consumo.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                mesa: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                cliente: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },

                pagado: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },

                fecha_apertura: {
                    type: DataTypes.DATE,
                    defaultValue: new Date(),
                },
                fecha_cierre: {
                    type: DataTypes.DATE,
                },
            },
            {
                sequelize: connection,
                // don't generate an "updatedAt" attribute
                createdAt: false,
                updatedAt: false,
            }
        );
        Consumo.hasMany(DetalleConsumo, {
            sourceKey: "id",
            foreignKey: "id",
            as: "detalles", // this determines the name in `associations`!
        });
    }
}
