// Modelo para categorias de productos
import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

// implementacion con sequelize de los clientes
export class Categoria extends Model<
    InferAttributes<Categoria>,
    InferCreationAttributes<Categoria>
> {
    // ------ SEQUELIZE initialization -------
    declare descripcion: string;
    declare id: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Categoria.init(
            {
                descripcion: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                id: {
                    type: DataTypes.NUMBER,
                    unique: true,
                    allowNull: false,
                    primaryKey: true,
                },
            },
            { sequelize: connection }
        );
    }
}
