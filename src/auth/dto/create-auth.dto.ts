import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateAuthDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(3,20, {
        message: 'password must have 3 to 20'
    })
    password: string;

}

