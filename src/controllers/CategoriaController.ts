import { Categoria } from "../db/Categoria";

export class CategoryController {
    static async getById(id: number): Promise<Categoria | null> {
        const res = await Categoria.findByPk(id);
        if (null == res) {
            return null;
        }

        return res;
    }

    static async listAll(): Promise<Categoria[]> {
        const res = await Categoria.findAll();
        return res;
    }

    static async add(cat: Categoria): Promise<Categoria> {
        return Categoria.create(cat);
    }

    static async delete(id: number) {
        await Categoria.destroy({ where: { id: id } }).catch(() => {});
    }

    static async update(id: number, newRest: Categoria) {
        return Categoria.update(
            { descripcion: newRest.descripcion },
            { where: { id: id } }
        );
    }
}
