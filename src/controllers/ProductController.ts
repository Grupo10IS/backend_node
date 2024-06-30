import { Categoria } from "../db/Categoria";
import { Product } from "../db/Product";

export class ProductController {
    static async getById(id: number): Promise<Product | null> {
        const res = await Product.findByPk(id);
        if (null == res) {
            return null;
        }

        return res;
    }

    static async listAll(): Promise<Product[]> {
        const res = await Product.findAll();
        return res;
    }

    static async add(prod: Product): Promise<Product | null> {
        try {
            // revisar que la categoria exista
            const cat = Categoria.findByPk(prod.categoria);
            if (cat == null) {
                throw "No existe categoria";
            }

            return Product.create(prod);
        } catch (error) {
            return null;
        }
    }

    static async delete(id: number) {
        await Product.destroy({ where: { id: id } }).catch(() => {});
    }

    static async update(id: number, newProd: Product) {
        return Product.update(newProd, { where: { id: id } });
    }
}
