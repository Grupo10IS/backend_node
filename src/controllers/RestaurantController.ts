import { Restaurant } from "../db/Restaurant";

// TODO: poner las validaciones
export class RestaurantController {
    static async getById(id: number): Promise<Restaurant | null> {
        const res = await Restaurant.findByPk(id);
        if (null == res) {
            return null;
        }

        return res;
    }

    static async listAll(): Promise<Restaurant[]> {
        const res = await Restaurant.findAll();
        return res;
    }

    static async add(nombre: string, direccion: string): Promise<Restaurant> {
        return Restaurant.create({
            name: nombre,
            address: direccion,
        });
    }

    static async delete(id: number) {
        await Restaurant.destroy({ where: { id: id } }).catch(() => {});
    }

    static async update(id: number, newRest: Restaurant) {
        return Restaurant.update(
            { name: newRest.name, address: newRest.address },
            { where: { id: id } }
        );
    }
}
