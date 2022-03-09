import { getRepository } from "typeorm";
import { Job } from "../entities/job.entity";
import { Product } from "../entities/product.entity";

export class JobService {

    static insert = async (description: string) => {
        const jobRepository = getRepository(Job);
        const job = jobRepository.create({ status: "PENDING", description });
        return jobRepository.save(job);
    }

    static update = async (id: number, status: string) => {
        const jobRepository = getRepository(Job);
        let job = await jobRepository.findOneOrFail(id);
        job = jobRepository.merge(job, { status })
        return jobRepository.save(job)
    }

    static findOne = async (id: number) => {
        const jobRepository = getRepository(Job);
        return jobRepository.findOne(id)
    }

    static delete = async (id: number) => {
        const jobRepository = getRepository(Job);
        const productRepository = getRepository(Product);
        await productRepository.delete({ jobId: id });
        return jobRepository.delete(id);
    }
}