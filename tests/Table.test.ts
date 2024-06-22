// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData, updateData } from "./utils";
import { initServer } from "../src/server";
import { Restaurant } from "../src/db/Restaurant";
import { apiTablesUrl } from "../src/constants";

const url = "http://localhost:8080" + apiTablesUrl;

describe(apiTablesUrl + " endpoint tests", async () => {
    beforeAll(async () => {
        await cleanDb();
        initServer().listen(8080, () => {});

        Restaurant.create({ address: "asuncion", name: "lidobar" });
    });

    // ---- GET ----
    it("Should create a new Table in a restaurant", async () => {
        const { response } = await postData(url, {
            name: "al lado del banho",
            resId: 1,
            posX: 1,
            posY: 1,
            floor: 1,
            capacity: 10,
        });

        expect(response.status).toEqual(200);
    });

    it("Should return the list of all tables", async () => {
        const { data, response } = await fetchData(`${url}`);
        expect(response.status).toEqual(200);
        expect(data.length).toEqual(1);
    });

    it("Should response with the tables list of the restaurant", async () => {
        const { data, response } = await fetchData(`${url}?resId=1`);

        expect(response.status).toEqual(200);
        expect(data.length).toEqual(1);

        const mesa = data[0];

        expect(mesa).toHaveProperty("name");
        expect(mesa).toHaveProperty("resId");
        expect(mesa).toHaveProperty("posX");
        expect(mesa).toHaveProperty("posY");
        expect(mesa).toHaveProperty("capacity");
        expect(mesa).toHaveProperty("floor");

        expect(mesa.name).toEqual("al lado del banho");
    });

    it("Should response with the info of the given table", async () => {
        const { data, response } = await fetchData(`${url}/1`);

        expect(response.status).toEqual(200);

        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("resId");
        expect(data).toHaveProperty("posX");
        expect(data).toHaveProperty("posY");
        expect(data).toHaveProperty("capacity");
        expect(data).toHaveProperty("floor");

        expect(data.name).toEqual("al lado del banho");
    });

    it("Should fail with not existing table", async () => {
        const { response } = await fetchData(`${url}/21`);
        expect(response.status).toEqual(404);
    });

    it("Should filter tables by minimum capacity", async () => {
        const { data, response } = await fetchData(`${url}?capacity=10`);

        expect(response.status).toEqual(200);
        expect(data.length).toEqual(1);

        expect(data[0]).toHaveProperty("name");
        expect(data[0]).toHaveProperty("resId");
        expect(data[0]).toHaveProperty("posX");
        expect(data[0]).toHaveProperty("posY");
        expect(data[0]).toHaveProperty("capacity");
        expect(data[0]).toHaveProperty("floor");

        expect(data[0].capacity).toBeGreaterThanOrEqual(10);
    });

    // ---- POST ----
    it("Should fail, restaurant already exists", async () => {
        const { response } = await postData(url, {
            name: "al lado del banho",
            resId: 1,
            posX: 1,
            posY: 1,
            floor: 1,
            capacity: 10,
        });

        expect(response.status).toEqual(409);
    });

    it("Should fail. Invalid post-body request", async () => {
        const cases = [
            {
                resId: 1,
                posX: 1,
                posY: 1,
                floor: 1,
                capacity: 5,
            },
            {
                resId: 1,
                floor: 1,
                capacity: 5,
            },
            {
                floor: 1,
                capacity: 5,
                posY: 1,
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await postData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    // ---- PUT ----
    it("Should fail. Invalid put-body request", async () => {
        const cases = [
            {
                resId: 1,
                posX: 1,
                posY: 1,
                floor: 1,
                capacity: 5,
            },
            {
                resId: 1,
                floor: 1,
                capacity: 5,
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await updateData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    it("Should 200. Updated succesfully", async () => {
        const cases = [
            {
                resId: 1,
                id: 1,
                posX: 1,
                posY: 1,
                floor: 1,
                capacity: 5,
            },
            {
                resId: 1,
                floor: 1,
                capacity: 5,
                id: 1,
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await updateData(url, element);
            expect(response.status).toEqual(200);
        });
    });

    // ---- DELETE ----
    it("Should fail. Invalid delete request", async () => {
        const cases = [
            {
                posY: 1,
                floor: 1,
            },
            {
                name: "al lado del banho",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await deleteData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    it("Should return status 200 and delete the table", async () => {
        const { response } = await deleteData(url, { id: 1 });
        expect(response.status).toEqual(200);

        const { data } = await fetchData(url);
        expect(data.length).toEqual(0);
    });
});
