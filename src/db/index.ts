import { Sequelize } from "sequelize";
import { Client } from "./Client";
import { Table } from "./Table";
import { Reservation } from "./Reservation";
import { Restaurant } from "./Restaurant";

export async function initDb(url?: string) {
    const dir = url || process.env.DB_URL || "sqlite:memmory:";

    const connection = new Sequelize(dir, {logging: false});

    // configure our sequelize models
    Client.configure(connection);
    Table.configure(connection);
    Reservation.configure(connection);
    Restaurant.configure(connection);

    await connection.sync().then();
    await connection.authenticate();

    return connection;
}
