import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export default class Cliente extends Model<
    InferAttributes<Cliente>,
    InferCreationAttributes<Cliente>
> {
    // there is no need to use CreationOptional on lastName because nullable attributes
    // are always optional in User.create()
    declare apellido: string;
    declare nombre: string;
    declare cedula: number;
    declare id: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Cliente.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    key: "id",
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                apellido: {
                    type: DataTypes.STRING,
                    key: "apellido",
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                nombre: {
                    type: DataTypes.STRING,
                    key: "nombre",
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                cedula: {
                    type: DataTypes.NUMBER,
                    key: "cedula",
                    unique: true,
                    allowNull: false,
                },
            },
            { sequelize: connection, tableName: "Cliente" }
        );
    }
}
