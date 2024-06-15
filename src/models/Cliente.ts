import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import { ClientInterface, Cliente } from "../contract/Cliente";

// implementacion con sequelize de los clientes
export class ClienteSeq
    extends Model<
        InferAttributes<ClienteSeq>,
        InferCreationAttributes<ClienteSeq>
    >
    implements ClientInterface
{
    // ------ SEQUELIZE initialization -------
    declare apellido: string;
    declare nombre: string;
    declare cedula: number;
    declare id: CreationOptional<number>;

    // Every Model Has to have a "configure" method, so it can be configured inside our db initializer
    public static configure(connection: Sequelize) {
        ClienteSeq.init(
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

    // ------ contract implementation -------
    async getById(id: number): Promise<Cliente> {
        const c = await ClienteSeq.findByPk(id);
        if (c == null) {
            throw "User does not exist";
        }

        return new Cliente(c.nombre, c.apellido, c.cedula, c.id);
    }

    async add(c: Cliente) {
        await ClienteSeq.create({
            cedula: c.cedula,
            nombre: c.nombre,
            apellido: c.apellido,
        });
    }
}
