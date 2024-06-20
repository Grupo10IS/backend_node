import { initDb } from "../src/db";

export async function fetchData(url) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    try {
        const data = await response.json();
        return { data, response };
    } catch (error) {
        return { undefined, response };
    }
}

export async function postData(url, params) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    try {
        const data = await response.json();
        return { data, response };
    } catch (error) {
        return { undefined, response };
    }
}

export async function updateData(url, params) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    try {
        const data = await response.json();
        return { data, response };
    } catch (error) {
        return { undefined, response };
    }
}

export async function cleanDb() {
    const connection = await initDb();
    await connection.drop({ cascade: true });
    await connection.sync();
}
