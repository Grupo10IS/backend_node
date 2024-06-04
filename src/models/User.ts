import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export default class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: DataTypes.IntegerDataType;

    // there is no need to use CreationOptional on lastName because nullable attributes
    // are always optional in User.create()
    declare lastName: string | null;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    key: "id"
                },
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
