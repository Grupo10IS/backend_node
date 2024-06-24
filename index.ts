import { initDb } from "./src/db";
import { initServer } from "./src/server";

async function main() {
    const port = 8080;

    const connection = await initDb();
    const app = initServer(connection);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main();
