import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";

// implementacion con sequelize de los clientes
export class Client extends Model<
    InferAttributes<Client>,
    InferCreationAttributes<Client>
> {
    // ------ SEQUELIZE initialization -------
    declare lastName: string;
    declare firstName: string;
    declare dni: number;
    declare id: CreationOptional<number>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Client.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
                dni: {
                    type: DataTypes.NUMBER,
                    unique: true,
                    allowNull: false,
                },
            },
            { sequelize: connection }
        );
    }
}
