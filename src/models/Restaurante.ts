import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export default class Restaurante extends Model<
    InferAttributes<Restaurante>,
    InferCreationAttributes<Restaurante>
> {
    // there is no need to use CreationOptional on lastName because nullable attributes
    // are always optional in User.create()
    declare direccion: string;
    declare nombre: string;
    declare id: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Restaurante.init(
            {
                direccion: {
                    type: DataTypes.STRING,
                    key: "direccion",
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                id: {
                    type: DataTypes.INTEGER,
                    key: "id",
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
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
            { sequelize: connection, tableName: "Restaurante" }
        );
    }
}
