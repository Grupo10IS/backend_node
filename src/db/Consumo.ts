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
import { Categoria } from "./Categorias";
import { Client } from "./Client";

export class Consumo extends Model<
    InferAttributes<Consumo>,
    InferCreationAttributes<Consumo>
> {
    declare id: CreationOptional<number>;
    declare mesa: ForeignKey<Categoria["id"]>;
    declare cliente: ForeignKey<Client["dni"]>;
    declare pagado: boolean; // true es "pagado", false es "aun con consumision"

    declare fecha_cierre: Date;
    declare fecha_apertura: Date;

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
    }
}
