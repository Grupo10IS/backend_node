import { Sequelize } from "sequelize";

// models
import User from "./models/User";
import { exit } from "process";

let connection: Sequelize;

// Bind the sequelize instance with the proper database models and schema
export async function initializeDb(url: string) {
    connection = new Sequelize(url);

    // configure our models
    User.configure(connection);

    try {
        await connection.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        exit(1);
    }
}

export function getConnection(): Sequelize {
    if (connection == null) {
        console.error("Database connection not stablished");
        exit(1);
    }

    return connection;
}
