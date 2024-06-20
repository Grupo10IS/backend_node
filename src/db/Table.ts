import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    CreationOptional,
} from "sequelize";
import { Restaurant } from "./Restaurant";

export class Table extends Model<
    InferAttributes<Table>,
    InferCreationAttributes<Table>
> {
    declare restaurant: ForeignKey<Restaurant["id"]>;
    declare name: string;
    declare posX: number;
    declare posY: number;
    declare floor: number;
    declare capacity: number;
    declare id: CreationOptional<number>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Table.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                posX: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                posY: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                floor: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
                capacity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                    validate: {
                        len: [1, 60],
                    },
                },
            },
            { sequelize: connection }
        );
    }
}
