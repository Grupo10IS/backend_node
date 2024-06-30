// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData, updateData } from "./utils";
import { initServer } from "../src/server";
import { apiProductosUrl } from "../src/constants";
import { Categoria } from "../src/db/Categoria";
import { TestContext } from "node:test";

const url = "http://localhost:8080" + apiProductosUrl;

describe("Products endpoint tests", async () => {
    beforeAll(async () => {
        await cleanDb();
        initServer().listen(8080, () => {});

        Categoria.create({
            descripcion: "Gaseosa",
        });
    });

    // ---- post ----
    it("Should create a new Prodduct", async () => {
        const { response } = await postData(url, {
            name: "coca",
            categoria: 1,
            precio: 10000,
        });

        expect(response.status).toEqual(200);
    });

    it("Should fail with 400. Invalid post request", async () => {
        const cases = [
            {
                name: "",
            },
            {
                name: "producto",
                precio: 1,
            },
            {
                name: "nombre valido",
                categoria: "obvio esto es invalido",
                precio: 1,
            },
            {
                name: "nombre valido",
                categoria: 2, // categoria no existe
                precio: "producto",
            },
            {
                name: "nombre valido",
                categoria: 1, // categoria no existe
                precio: "tipo de dato invalido",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await postData(url, element);
            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });

    // ---- GET ----
    it("Should response with the products list", async () => {
        const { data, response } = await fetchData(`${url}`);

        expect(response.status).toEqual(200);

        expect(data.length).toEqual(1);

        const categoria = data[0];
        expect(categoria).toHaveProperty("name");
        expect(categoria.name).toEqual("coca");
    });

    // ---- PUT ----
    it("Should reponse 200. Invalid put request succesfull", async () => {
        const { response } = await updateData(url, {
            id: 1,
            name: "nuevo nombre",
        });
        expect(response.status).toEqual(200);
    });

    it("Should fail. Invalid put-body request", async () => {
        const cases = [
            {
                name: "",
            },
            {
                nada: "",
            },
            {
                name: 1,
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
                nada: "",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await updateData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    it("Should return status 200 and delete the product", async () => {
        const { response } = await deleteData(url, { id: 1 });
        expect(response.status).toEqual(200);

        const { data } = await fetchData(url);
        expect(data.length).toEqual(0);
    });
});
