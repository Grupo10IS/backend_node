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

export class Producto extends Model<
    InferAttributes<Producto>,
    InferCreationAttributes<Producto>
> {
    declare id: CreationOptional<number>;
    declare categoria: ForeignKey<Categoria["id"]>;
    declare name: string;
    declare precio: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Producto.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                precio: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                categoria: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
            },
            { sequelize: connection }
        );
    }
}
