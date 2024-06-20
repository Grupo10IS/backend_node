import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";

export class Restaurant extends Model<
    InferAttributes<Restaurant>,
    InferCreationAttributes<Restaurant>
> {
    // there is no need to use CreationOptional on lastName because nullable attributes
    // are always optional in User.create()
    declare address: string;
    declare name: string;
    declare id: CreationOptional<number>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Restaurant.init(
            {
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        len: [1, 60],
                    },
                },
            },
            { sequelize: connection }
        );
    }
}
