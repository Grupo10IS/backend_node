// Modelo para categorias de productos
import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";

// implementacion con sequelize de los clientes
export class Categoria extends Model<
    InferAttributes<Categoria>,
    InferCreationAttributes<Categoria>
> {
    // ------ SEQUELIZE initialization -------
    declare descripcion: string;
    declare id: CreationOptional<number>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Categoria.init(
            {
                descripcion: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                id: {
                    type: DataTypes.INTEGER,
                    unique: true,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
            },
            { sequelize: connection }
        );
    }
}
