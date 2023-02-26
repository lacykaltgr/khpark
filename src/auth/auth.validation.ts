import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullname: string;


  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}


