import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
} from "sequelize";
import Mesa from "./Mesa";
import Cliente from "./Cliente";

export default class Reserva extends Model<
    InferAttributes<Reserva>,
    InferCreationAttributes<Reserva>
> {
    declare mesa: ForeignKey<Mesa["id"]>;
    declare cliente: ForeignKey<Cliente["id"]>;
    declare fecha: Date;
    declare horario_inicio: number;
    declare horario_fin: number;
    declare id: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        Reserva.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    key: "id",
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                horario_inicio: {
                    type: DataTypes.INTEGER,
                    key: "inicio",
                    allowNull: false,
                    validate: {
                        min: 12,
                        max: 23,
                    },
                },
                horario_fin: {
                    type: DataTypes.INTEGER,
                    key: "fin",
                    allowNull: false,
                    validate: {
                        min: 12,
                        max: 23,
                    },
                },
                fecha: {
                    type: DataTypes.DATE,
                    key: "fecha",
                    allowNull: false,
                },
            },
            { sequelize: connection, tableName: "Reserva" }
        );
    }
}
