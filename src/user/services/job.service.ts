import { getRepository } from "typeorm";
import { Job } from "../entities/job.entity";

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
}