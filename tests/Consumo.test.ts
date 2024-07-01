import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData, updateData } from "./utils";
import { initServer } from "../src/server";
import { apiConsumoUrl } from "../src/constants"; // Asumiendo que apiReservationsUrl es el endpoint correcto para Consumo
import { Categoria } from "../src/db/Categoria";
import { Restaurant } from "../src/db/Restaurant";
import { Table } from "../src/db/Table";
import { Product } from "../src/db/Product";
import { Client } from "../src/db/Client";

const url = "http://localhost:8080" + apiConsumoUrl;

describe("Consumo endpoint tests", async () => {
    beforeAll(async () => {
        await cleanDb(); // Limpia la base de datos antes de comenzar las pruebas
        initServer().listen(8080, () => {}); // Inicializa el servidor antes de las pruebas

        await Categoria.create({
            descripcion: "Gaseosa",
        });

        await Product.create({
            name: "Cocoa",
            categoria: 1,
            precio: 10,
        });

        await Client.create({
            firstName: "Elias",
            lastName: "lidobar",
            dni: 1,
        });

        await Client.create({
            firstName: "Alexis",
            lastName: "personal",
            dni: 2,
        });

        await Restaurant.create({ address: "asuncion", name: "lidobar" });
        await Table.create({
            name: "al lado del banho",
            resId: 1,
            posX: 1,
            posY: 1,
            floor: 1,
            capacity: 10,
        });
    });

    // ---- POST ----
    it("Should create a new consumption", async () => {
        const { response } = await postData(url, {
            mesa: 1,
            cliente: 1,
        });

        expect(response.status).toEqual(200);
    });

    it("Should fail. Consumption already exists", async () => {
        const { response } = await postData(url, {
            mesa: 1,
            cliente: 1,
        });

        expect(response.status).toEqual(400);
    });

    it("Should fail with 400. Invalid post request", async () => {
        const cases = [
            {
                cliente: 1,
                pagado: false,
            },
            {
                mesa: 1,
                pagado: false,
            },
            {
                mesa: 1,
                cliente: "alksdjalskjd",
            },
            {
                mesa: 1,
                cliente: 1234, // cliente no existe
            },
            {
                mesa: 123, // mesa no existe
                cliente: 1,
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await postData(url, element);
            expect(response.status).toEqual(400);
        });
    });

    // ---- GET ----
    it("Should response with the consumption information", async () => {
        const { data, response } = await fetchData(url + "/1");

        expect(response.status).toEqual(200);
        expect(data).toHaveProperty("mesa");
        expect(data).toHaveProperty("cliente");
        expect(data).toHaveProperty("pagado");
        expect(data).toHaveProperty("detalles");

        expect(new Date(data.fecha_apertura).getDate()).toEqual(
            new Date().getDate()
        );
        expect(data.pagado).toEqual(false);
    });

    it("Should fail with 404. Consumision does not exist", async () => {
        const { response } = await fetchData(url + "/122");
        expect(response.status).toEqual(404);
    });

    // ---- PUT ----
    it("Should response 200. Update successful", async () => {
        const { response } = await updateData(url + "/1", {
            cliente: 2,
        });

        expect(response.status).toEqual(200);

        const { data } = await fetchData(url + "/1");
        expect(data.pagado).toEqual(false);
        expect(data.cliente).toEqual(2);
    });

    // TODO: hacer que funcione
    it("Should fail. Invalid put-body request", async () => {
        const cases = [
            {
                cliente: "aslkdjaslkdj",
                mesa: 1,
                expected: 400,
                msg: "CLiente invalido",
            },
            {
                mesa: "alskdjasldkj",
                cliente: 1,
                expected: 404,
                msg: "Id de mesa invalido",
            },
            {
                mesa: 12,
                cliente: 1,
                expected: 409,
                msg: "Mesa no cuenta con consumision",
            },
            {
                mesa: 1,
                cliente: 1234,
                expected: 409,
                msg: "Cliente no existe",
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await updateData(
                url + "/" + element.mesa,
                element
            );
            expect(response.status).toEqual(element.expected);
        });
    });

    // ---- DELETE ----
    it("Should response 200. Consumo pagado", async () => {
        const { response } = await deleteData(url + "/1", {});

        expect(response.status).toEqual(200);

        const { response: resp } = await fetchData(url + "/1");
        expect(resp.status).toEqual(404);
    });
});
