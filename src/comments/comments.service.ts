import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {

  private readonly logger = new Logger('CommentsService');

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository : Repository<Comment>
  ){}

/*
  async create(createCommentDto: CreateCommentDto) {
    
    try {
        //Crea la instancia del comment, pero aún no lo guarda en la bdd
        const comment = this.commentRepository.create(createCommentDto);

        //Acá lo guarda en la base de datos
        await this.commentRepository.save( comment );

        return comment;
        
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
*/

  async createCommentWithUser(dto: CreateCommentDto, userId: string, userName: string) {
    try {
      const comment = this.commentRepository.create({
        ...dto,
        userId,
        userName,
      });

      return await this.commentRepository.save(comment);
          
      } catch (error) {
        this.handleDBExceptions(error)
      }
  }


 async findAll() {
    return this.commentRepository.find({})
  }



 async update(id: string, updateCommentDto: UpdateCommentDto) {

    const comment = await this.commentRepository.preload({
      id: id,
      ...updateCommentDto //le agrega las propiedades al objeto que tenga ese id
    });

    if ( !comment ) throw new NotFoundException(`El comentario con el id: ${ id } no fue encontrado`);

    try {
      await this.commentRepository.save( comment );
      return comment;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

 async remove(id: string) {
    const comment = await this.findOneById( id );
    await this.commentRepository.remove( comment );
  }


 async findOneById(id: string) {
    
    let comment = await this.commentRepository.findOneBy({ id: id });

    if ( !comment ) 
      throw new NotFoundException(`El comentario con  el id:${id } no fue encontrado`);

    return comment;
  }

  async findByEpisodeId(episodeId: string): Promise<Comment[]> {
  const comments = await this.commentRepository.find({
    where: {
      episodeId,
      state: true
    },
    order: {
      creationDate: 'ASC' // Ordena del más viejo al más nuevo (podés usar 'DESC' si querés al revés)
    }
  });

  return comments;
}


  private handleDBExceptions( error: any ) {
    console.log(error);

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error) // Muestra el error

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
