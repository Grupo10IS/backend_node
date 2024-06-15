import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
} from "sequelize";
import { MesaSeq } from "./Mesa";
import { ClienteSeq } from "./Cliente";

export class ReservaSeq extends Model<
    InferAttributes<ReservaSeq>,
    InferCreationAttributes<ReservaSeq>
> {
    declare mesa: ForeignKey<MesaSeq["id"]>;
    declare cliente: ForeignKey<ClienteSeq["id"]>;
    declare fecha: Date;
    declare horario_inicio: number;
    declare horario_fin: number;
    declare id: number;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        ReservaSeq.init(
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
