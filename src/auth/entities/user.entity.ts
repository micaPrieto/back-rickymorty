import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//La ENTIDAD es la que me establece la relacion con la tabla de la bdd
// Esta entidad va a corresponder a una tabla en la bdd
// Para que esto aparezca en TablePlus, tengo que ir a auth.module 
// y colocar  TypeOrmModule.forFeature([User]) en los imports

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('text', { nullable: true }) //nullable: que puede contener null
    phone?: string;

    @Column('date', { nullable: true })
    birthday?: Date;

    @Column('jsonb', { nullable: true })
    address?: {
        street?: string;
        city?: string;
        location?: string;
        country?: string;
        cp?: string;
    };

    @BeforeInsert() //Antes de insertar
    checkFieldsBeforeInsert() {//Pasa el email a minuscula y elimina los espacios
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate() //Antes de actualizar
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

    @Column('text', { array: true, default: [] })
    episodesFavorites: string[]; 

}



        /*
    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;
    */