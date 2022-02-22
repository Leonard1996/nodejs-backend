import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Common } from "../../common/entities/common";
import { Job } from "./job.entity";

@Entity("products")
export class Product extends Common {

    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "name",
    })
    public name: string;

    @Column({
        nullable: true,
        name: "description",
        type: "text",
    })
    public description: string;

    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "sku",
    })
    public sku: string;

    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "image",
    })
    public image: string;


    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "url",
    })
    public url: string;

    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "mpn",
    })
    public mpn: string;

    @Column("text", {
        nullable: true,
        name: "raw",
    })
    public raw: string;

    @Index()
    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "category",
    })
    public category: string;

    @Column("text", {
        nullable: true,
        name: "offer",
    })
    public offer: string;

    @Column("text", {
        nullable: true,
        name: "brand",
    })
    public brand: string;

    @ManyToOne(type => Job, job => job.products)
    @JoinColumn({ name: "job_id" })
    public job: Job

    @Column("int", {
        nullable: true,
        name: "job_id",
    })
    public jobId: number;

}
