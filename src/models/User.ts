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
    declare lastName: string | null;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Cliente.init(
            {
                lastName: {
                    type: DataTypes.STRING,
                    key: "apellido",
                    validate: {
                        len: [1, 30],
                    },
                },
            },
            { sequelize: connection, tableName: "Usuario" }
        );
    }
}
