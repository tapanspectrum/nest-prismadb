import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
import { emit } from 'process';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {

  constructor(
    private readonly prismaservice: PrismaService
  ) { }

  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const getAllUsers = await this.prismaservice.user.findMany(
      {
        select: {
          id: true,
          email: true
        }
      }
    );
    return getAllUsers;
  }

  async findOne(id: string, req: Request) {

    const finduser = await this.prismaservice.user.findUnique({
      where: {
        id
      }
    });
    if(!finduser){
      throw new NotFoundException()
    };

    const decodedUser = req.user as {id: string, email: string};
    console.log(decodedUser);
    if(finduser.id != decodedUser.id){
      throw new ForbiddenException();
    }
    delete finduser.password;
    return finduser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
