import { initDb } from "./src/db";
import { initServer } from "./src/server";

async function main() {
    const port = 8080;

    await initDb();
    const app = initServer();

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main();
