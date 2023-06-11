import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { CreateAuthDto } from "src/auth/dto/create-auth.dto";
import { Auth } from "src/auth/entities/auth.entity";

export class CreateUserDto extends CreateAuthDto {
    
    @Exclude()
    password: string;
    
    constructor(partial: Partial<Auth>) {
        super();
        Object.assign(this, partial);
      }
}
