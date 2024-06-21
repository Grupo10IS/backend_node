// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData, updateData } from "./utils";
import { initServer } from "../src/server";

const url = "http://localhost:8080/api/restaurant";

describe("/api/restaurants endpoint tests", async () => {
    beforeAll(async () => {
        await cleanDb();
        initServer().listen(8080, () => {
            console.log(`Server is running on http://localhost:${8080}`);
        });
    });

    // ---- GET ----
    it("Should create a new Restaurant", async () => {
        const { response } = await postData(url, {
            address: "espanha",
            name: "El Celler de Can Roca",
        });

        await postData(url, {
            address: "Asuncion",
            name: "Pizza Hut",
        });

        expect(response.status).toEqual(200);
    });

    it("Should response with the restaurants list", async () => {
        const { data, response } = await fetchData(`${url}`);

        expect(response.status).toEqual(200);

        expect(data.length).toEqual(2);

        const celler = data[0];

        expect(celler).toHaveProperty("name");
        expect(celler).toHaveProperty("address");
        expect(celler).toHaveProperty("id");

        expect(celler.name).toEqual("El Celler de Can Roca");
        expect(celler.address).toEqual("espanha");
    });

    it("Should filter the restaurants by id", async () => {
        const { data, response } = await fetchData(`${url}?id=1`);

        expect(response.status).toEqual(200);

        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("address");
        expect(data).toHaveProperty("id");

        expect(data.name).toEqual("El Celler de Can Roca");
        expect(data.address).toEqual("espanha");
    });

    it("Should response 204 restaurant not found", async () => {
        const { response } = await fetchData(url + "?id=20");
        expect(response.status).toEqual(204);
    });

    // ---- POST ----
    it("Should fail. Invalid post-body request", async () => {
        const cases = [
            {
                name: 2,
            },
            {
                address: "",
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
                name: "",
                address: "",
            },
            {
                id: 1,
                address: "",
            },
            {
                id: 1,
                name: "",
            },
            {
                id: 1,
            },
            {
                name: "",
            },
            {
                address: "",
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
                name: "",
                address: "",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await updateData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    it("Should return status 200 and delete the restaurant", async () => {
        const { response } = await deleteData(url, { id: 1 });
        expect(response.status).toEqual(200);

        const { data } = await fetchData(url);
        expect(data.length).toEqual(1);
    });
});
