import { Client } from "../db/Client";

// TODO: poner las validaciones
export class ClientController {
    static async getById(dni: number): Promise<Client | null> {
        try {
            const res = await Client.findOne({ where: { dni: dni } });
            return res;
        } catch (error) {
            return null;
        }
    }

    static async listAll(): Promise<Client[] | null> {
        try {
            const res = await Client.findAll();
            return res;
        } catch (error) {
            return null;
        }
    }

    static async add(
        name: string,
        lastName: string,
        dni: number
    ): Promise<Client> {
        return Client.create({
            firstName: name,
            lastName: lastName,
            dni: dni,
        });
    }
}
