import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column('text')
    userId: string;

    @Column('text')
    userName: string;

    @Column('text')
    episodeId: string;
    
    @Column('text')
    comment: string;

    @Column('bool', {
        default: true
    })
    state: boolean;

    @Column('timestamp')
    creationDate: Date;

    @Column('timestamp')
    updateDate: Date;

  @BeforeInsert()
    setCreationDate() {
        this.creationDate = this.getArgentinaDate();
        this.updateDate = this.creationDate; // También se setea acá por primera vez
    }

    @BeforeUpdate()
    setUpdateDate() {
        this.updateDate = this.getArgentinaDate();
    }

    private getArgentinaDate(): Date {
        const now = new Date();
        const offsetMs = -3 * 60 * 60 * 1000; // UTC-3 en milisegundos
        return new Date(now.getTime() + offsetMs);
    }
}
