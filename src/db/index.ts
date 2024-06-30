import { Sequelize } from "sequelize";
import { Client } from "./Client";
import { Table } from "./Table";
import { Reservation } from "./Reservation";
import { Restaurant } from "./Restaurant";
import { Categoria } from "./Categoria";

export async function initDb(url?: string) {
    const dir = url || process.env.DB_URL || "sqlite:memmory:";

    const connection = new Sequelize(dir, {
        logging: false,
        dialectOptions: {
            useUTC: false, // Disable automatic UTC conversion for reading
            dateStrings: true, // Treat DATE and DATETIME fields as strings
        },
    });

    // configure our sequelize models
    Client.configure(connection);
    Table.configure(connection);
    Reservation.configure(connection);
    Restaurant.configure(connection);
    Categoria.configure(connection);

    await connection.sync().then();
    await connection.authenticate();

    return connection;
}
