// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData, updateData } from "./utils";
import { initServer } from "../src/server";
import { apiCategoriaUrl } from "../src/constants";

const url = "http://localhost:8080" + apiCategoriaUrl;

describe("Categoria endpoint tests", async () => {
    beforeAll(async () => {
        await cleanDb();
        initServer().listen(8080, () => {});
    });

    // ---- post ----
    it("Should create a new category", async () => {
        const { response } = await postData(url, {
            descripcion: "Gaseosas",
        });

        expect(response.status).toEqual(200);
    });

    it("Should fail. Category already exists", async () => {
        const { response } = await postData(url, {
            descripcion: "Gaseosas",
        });

        expect(response.status).toEqual(409);
    });

    it("Should fail with 400. Invalid post request", async () => {
        const cases = [
            {
                descripcion: "", // descripcion vacia
            },
            {
                nada: "nombre invalido",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await postData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    // ---- GET ----
    it("Should response with the categories list", async () => {
        const { data, response } = await fetchData(`${url}`);

        expect(response.status).toEqual(200);

        expect(data.length).toEqual(1);

        const categoria = data[0];
        expect(categoria).toHaveProperty("descripcion");
        expect(categoria.descripcion).toEqual("Gaseosas");
    });

    // ---- PUT ----
    it("Should reponse 200. Invalid put request succesfull", async () => {
        const { response } = await updateData(url, {
            descripcion: "nuevo nombre",
            id: 1,
        });

        expect(response.status).toEqual(200);

        // eslint-disable-next-line
        const r2 = await fetchData(url);
        expect(r2.data[0].descripcion).toEqual("nuevo nombre");
    });

    it("Should fail. Invalid put-body request", async () => {
        const cases = [
            {
                descripcion: "",
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
            {
                descripcion: 1,
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await deleteData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    it("Should return status 200 and delete the category", async () => {
        const { response } = await deleteData(url, { id: 1 });
        expect(response.status).toEqual(200);

        const { data } = await fetchData(url);
        expect(data.length).toEqual(0);
    });
});
