import { Op } from "sequelize";
import { Table } from "../db/Table";

type filters = {
    floor?: string;
    capacity?: string;
    resId?: string;
};

// TODO: poner las validaciones
export class TableController {
    static async listAll(filter: filters): Promise<Table[] | null> {
        // eslint-disable-next-line
        const where: any = {};

        if (filter.floor !== undefined) {
            where.floor = parseInt(filter.floor);
        }

        if (filter.capacity !== undefined) {
            console.log(filter.capacity);
            where.capacity = {
                [Op.gte]: [parseInt(filter.capacity)],
            };
        }

        if (filter.resId !== undefined) {
            where.resId = parseInt(filter.resId);
        }

        const results = await Table.findAll({
            where: where,
        });

        return results;
    }

    static async findById(id: number): Promise<Table | null> {
        const res = await Table.findByPk(id);
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
            resId: resId,
            posX: posX,
            posY: posY,
            floor: floor,
            capacity: capacity,
        });
    }

    static async delete(id: number) {
        await Table.destroy({ where: { id: id } });
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
