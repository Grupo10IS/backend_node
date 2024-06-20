import { Table } from "../db/Table";

// TODO: poner las validaciones
export class ClientController {
    static async listByFloor(
        resId: number,
        floor: number
    ): Promise<Table[] | null> {
        const res = await Table.findAll({
            where: { restaurant: resId, floor: floor },
        });
        return res;
    }

    static async add(
        name: string,
        resId: number,
        posX: number,
        posY: number,
        floor: number,
        capacity: number
    ) {
        await Table.create({
            name: name,
            restaurant: resId,
            posX: posX,
            posY: posY,
            floor: floor,
            capacity: capacity,
        });
    }

    static async delete(id: number) {
        await Table.destroy({ where: { id: id } });
    }

    static create(
        name: string,
        resId: number,
        posX: number,
        posY: number,
        floor: number,
        capacity: number
    ) {
        return Table.create({
            name: name,
            restaurant: resId,
            posX: posX,
            posY: posY,
            floor: floor,
            capacity: capacity,
        });
    }

    static async update(
        id: number,
        name?: string,
        posX?: number,
        posY?: number,
        floor?: number,
        capacity?: number
    ) {
        const actual = await Table.findByPk(id);

        if (actual == null) {
            return null;
        }

        if (floor != undefined) {
            actual.floor = floor;
            actual.set("floor", floor);
        }

        if (capacity != undefined) {
            actual.capacity = capacity;
            actual.set("capacity", capacity);
        }

        if (name != undefined) {
            actual.name = name;
            actual.set("name", name);
        }

        if (posX != undefined) {
            actual.posX = posX;
            actual.set("posX", posX);
        }

        if (posY != undefined) {
            actual.posY = posY;
            actual.set("posY", posY);
        }

        await actual.save();
    }
}
