// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, fetchData, postData } from "./utils";
import { initServer } from "../src/server";
import { apiClientUrl } from "../src/constants";

const url = "http://localhost:8080" + apiClientUrl;

describe("Client", async () => {
    beforeAll(async () => {
        await cleanDb();
        initServer().listen(8080, () => {});
    });

    it("Should create a new Client", async () => {
        const { response } = await postData(url, {
            dni: 1,
            firstName: "elias",
            lastName: "gill",
        });

        expect(response.status).toEqual(200);
    });

    it("Should response 200 client found succesfully", async () => {
        const { data, response } = await fetchData(`${url}?dni=1`);

        expect(response.status).toEqual(200);

        expect(data).toHaveProperty("firstName");
        expect(data).toHaveProperty("dni");
        expect(data).toHaveProperty("lastName");

        expect(data.dni).toEqual(1);
        expect(data.firstName).toEqual("elias");
        expect(data.lastName).toEqual("gill");
    });

    it("Should response 204 client not found", async () => {
        const { response } = await fetchData(url + "?dni=2");
        expect(response.status).toEqual(204);
    });

    it("Should fail. Client already exists", async () => {
        const { response } = await postData(url, {
            dni: 1,
            firstName: "elias",
            lastName: "gill",
        });

        expect(response.status).toEqual(409);
    });

    it("Should fail. Invalid post-body request", async () => {
        const cases = [
            {
                dni: 2,
                firstName: "",
            },
            {
                dni: 2,
                lastName: "",
            },
            {
                firstName: "",
                lastName: "",
            },
            {
                dni: 2,
                firstName: 1,
                lastName: "",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await postData(url, element);
            expect(response.status).toEqual(400);
        });
    });
});
