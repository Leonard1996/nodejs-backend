import { getManager, getRepository, TransactionAlreadyStartedError } from "typeorm";
import { Product } from "../entities/product.entity";


export class ProductService {

    static insert = async (products, jobId: number, category?: string) => {
        const productRepository = getRepository(Product);

        for (const product of products) {
            if (Object.keys(product)) {
                let newProduct = productRepository.create({ ...product, raw: JSON.stringify(product), offer: JSON.stringify(product.offers), brand: JSON.stringify(product.brand), jobId, category })
                await productRepository.save(newProduct);
            }
        }
    }

    static getLatest = () => {
        return getManager().query(`select * from products where job_id in (Select max(jobs.id) from jobs where status = 'SUCCESS')`)
    }

    static list = (jobId: number) => {
        const productRepository = getRepository(Product);
        return productRepository.find({ where: { jobId } });
    }

    static async update(product) {
        const productRepository = getRepository(Product);
        let oldProduct = await productRepository.findOne(product.id);
        console.log({ oldProduct, product })
        product = productRepository.merge(oldProduct, { raw: JSON.stringify(product), offer: JSON.stringify(product.offers), brand: JSON.stringify(product.brand), name: product.name, description: product.description, mpn: product.mpn, sku: product.sku, image: product.image });
        return productRepository.save(product);
    }
}