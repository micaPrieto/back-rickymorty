import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "stream";

export class CreateCommentDto {

    @IsString()
    @MinLength(1)
    episodeId: string;
 
    @IsString()
    @MinLength(1)
    comment: string;



    /*
    @IsString()
    @MinLength(1)
    userId: string;

    @IsOptional()
    @IsDateString()
    creationDate?: Date;

    @IsBoolean()
    state?: boolean;
    */

}
    

    


