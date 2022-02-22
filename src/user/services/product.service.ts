import { getManager, getRepository } from "typeorm";
import { Product } from "../entities/product.entity";


export class ProductService {

    static insert = async (products) => {
        const productRepository = getRepository(Product);

        for (const product of products) {
            if (Object.keys(product)) {
                let newProduct = productRepository.create({ ...product, raw: JSON.stringify(product), offer: JSON.stringify(product.offers), brand: JSON.stringify(product.offers), })
                await productRepository.save(newProduct);
            }
        }
    }

    static getLatest = () => {
        return getManager().query(`select * from products where job_id in (Select max(jobs.id) from jobs where status = 'SUCCESS')`)
    }
}