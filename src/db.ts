import { Sequelize } from "sequelize";

// models
import User from "./models/User";

// Bind the sequelize instance with the proper database models and schema
export function initDb(url: string) {
    const connection = new Sequelize(url);

    // configure our models
    User.configure(connection);

    connection.sync().then();
}
