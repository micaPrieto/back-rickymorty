import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";


class AddressDto {
  @IsOptional()
  street?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  cp?: string;
}

export class CreateUserDto {

    @IsString()
    @IsEmail()
    @MinLength(10)
    @MaxLength(50)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    /*@Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })*/
    password: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    fullName: string;


    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsDateString()
    birthday?: Date;

    @IsOptional()
    @ValidateNested() //que valide las propiedades internas del objeto usando otro DTO
    @Type(() => AddressDto)
    address?: AddressDto;
}

