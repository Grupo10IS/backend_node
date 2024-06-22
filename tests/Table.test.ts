// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData, updateData } from "./utils";
import { initServer } from "../src/server";
import { Restaurant } from "../src/db/Restaurant";

const url = "http://localhost:8080/api/tables";

describe("/api/Tables/:resId/:tableId endpoint tests", async () => {
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
            capacity: 5,
        });

        expect(response.status).toEqual(200);
    });

    it("Should response with the tables list of the restaurant", async () => {
        const { data, response } = await fetchData(`${url}/1`);

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
        const { data, response } = await fetchData(`${url}/1/1`);

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
        const { response } = await fetchData(`${url}/1/21`);
        expect(response.status).toEqual(404);
    });

    it("Should filter tables by minimum capacity", async () => {
        const { data, response } = await fetchData(`${url}?capacity=10`);

        expect(response.status).toEqual(200);

        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("resId");
        expect(data).toHaveProperty("posX");
        expect(data).toHaveProperty("posY");
        expect(data).toHaveProperty("capacity");
        expect(data).toHaveProperty("floor");

        expect(data.capacity).toBeGreaterThanOrEqual(10);
    });

    it("Should 400. Invalid filter", async () => {
        const { response } = await fetchData(`${url}?capacity=nada`);
        expect(response.status).toEqual(404);
    });

    // ---- POST ----
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
                id: 2,
            },
            {
                name: "al lado del banho",
                resId: 1,
                posX: 1,
                posY: 1,
                floor: 1,
                capacity: 5,
                // whithout id
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await updateData(url, element);
            expect(response.status).toEqual(400);
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
            const { response } = await updateData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    it("Should return status 200 and delete the table", async () => {
        const { response } = await deleteData(url, { id: 1 });
        expect(response.status).toEqual(200);

        const { data } = await fetchData(url);
        expect(data.length).toEqual(1);
    });
});
