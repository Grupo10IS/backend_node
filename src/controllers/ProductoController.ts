import { Producto } from "../db/Producto";

export class ProductoController {
    static async getById(id: number): Promise<Producto | null> {
        const res = await Producto.findByPk(id);
        if (null == res) {
            return null;
        }

        return res;
    }

    static async listAll(): Promise<Producto[]> {
        const res = await Producto.findAll();
        return res;
    }

    static async add(
        categoria: string,
        name: string,
        precio: string
    ): Promise<Producto | null> {
        try {
            return Producto.create({
                name: name,
                categoria: parseInt(categoria),
                precio: parseInt(precio),
            });
        } catch (error) {
            return null;
        }
    }

    static async delete(id: number) {
        await Producto.destroy({ where: { id: id } }).catch(() => {});
    }

    static async update(id: number, newProd: Producto) {
        return Producto.update(newProd, { where: { id: id } });
    }
}
