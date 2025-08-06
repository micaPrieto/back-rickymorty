import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";


class AddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
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
    @MinLength(5)
    @MaxLength(15)
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

