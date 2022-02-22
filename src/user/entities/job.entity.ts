import { Column, Entity, OneToMany } from "typeorm";
import { Common } from "../../common/entities/common";
import { Product } from "./product.entity";

@Entity("jobs")
export class Job extends Common {

    @Column("varchar", {
        nullable: true,
        length: 256,
        name: "description",
    })
    public description: string;

    @Column("varchar", {
        default: "PENDING",
        length: 256,
        name: "status",
    })
    public status: string;

    @OneToMany(type => Product, product => product.job)
    products: Product[]

}
