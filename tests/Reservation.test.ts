// tests for the functions go here
import { beforeAll, describe, expect, it } from "vitest";
import { cleanDb, deleteData, fetchData, postData } from "./utils";
import { initServer } from "../src/server";
import { Restaurant } from "../src/db/Restaurant";
import { Table } from "../src/db/Table";
import { apiReservationsUrl, apiTablesUrl } from "../src/constants";
import { Client } from "../src/db/Client";

const url = "http://localhost:8080" + apiReservationsUrl;

describe(apiTablesUrl + " reservationEndpoint tests", async () => {
    beforeAll(async () => {
        await cleanDb();
        initServer().listen(8080, () => {});

        Restaurant.create({ address: "asuncion", name: "lidobar" });
        Client.create({ firstName: "asuncion", lastName: "lidobar", dni: 1 });
        Table.create({
            resId: 1,
            name: "mesa 1",
            posX: 1,
            posY: 1,
            floor: 1,
            capacity: 10,
        });
    });

    // ---- GET ----
    it("Should create a new Reservation", async () => {
        const { response } = await postData(url, {
            clientDni: 1,
            tableId: 1,
            date: "2024-06-22",
            reservationStart: 13,
            reservationEnd: 14,
        });

        expect(response.status).toEqual(200);
    });

    it("Should return the list of all reservations", async () => {
        const { data, response } = await fetchData(`${url}`);
        expect(response.status).toEqual(200);
        expect(data.length).toEqual(1);
    });

    it("Should response with the reservations list filtered by restaurant, date and client", async () => {
        const { data, response } = await fetchData(
            `${url}?resId=1&clientDni=1&date=2024-06-22`
        );

        expect(response.status).toEqual(200);
        expect(data.length).toEqual(1);
    });

    // ---- POST ----
    it("Should fail, reservation conflict", async () => {
        const { response } = await postData(url, {
            clientDni: 1,
            tableId: 1,
            date: "2024-06-22",
            reservationStart: 13,
            reservationEnd: 14,
        });

        expect(response.status).toEqual(409);
    });

    it("Should create a new reservation but with almost exact same schedule", async () => {
        const { response } = await postData(url, {
            clientDni: 1,
            tableId: 1,
            date: "2024-06-22",
            reservationStart: 14,
            reservationEnd: 15,
        });

        expect(response.status).toEqual(200);
    });

    it("Should fail. Invalid post-body request", async () => {
        const cases = [
            {
                clientDni: "al lado del banho",
                tableId: 1,
                date: "2024-06-22",
                reservationEnd: 15,
            },
            {
                tableId: 1,
                date: "2024-06-22",
                reservationStart: 14,
            },
            {
                clientDni: 1,
                reservationStart: 14,
                reservationEnd: 15,
            },
            {
                clientDni: "al lado del banho",
                tableId: 1,
                reservationStart: 14,
                reservationEnd: 15,
            },
        ];

        cases.forEach(async (element) => {
            const { response } = await postData(url, element);
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
            const { response } = await deleteData(url, element);
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
