import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bycrpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtservice: JwtService
  ) { }

  async create(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const hashpasswod = await this.hashPassword(password);
    const founduser = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (founduser) {
      throw new BadRequestException('Email already exist !!')
    }
    const userdata = await this.prisma.user.create({
      data: {
        email,
        password: hashpasswod
      }
    });
    return userdata;
  }

  async findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async signin(createAuthDto: CreateAuthDto, req: Request, res: Response) {
    const { email, password } = createAuthDto;
    const founduser = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!founduser) {
      throw new BadRequestException('Wrong Credentials !!');
    }

    const isMatched = await this.comparePassword(password, founduser.password);
    if (!isMatched) {
      throw new BadRequestException('Wrong Credentials !!');
    }
    const tokenvalue = await this.genrateToken({ id: founduser.id, email: founduser.email });
    if (!tokenvalue) {
      throw new ForbiddenException();
    }
    res.cookie('token', tokenvalue)
    return res.json({message: 'Signin Successfully !!'});
  }

  async signout(req: Request, res: Response) {
    console.log('Hi');
    res.clearCookie('token');
    return res.json(
      {message: 'SignOut Successfully !!'});
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashpasswod = await bycrpt.hash(password, saltOrRounds);
    return hashpasswod;
  }

  async comparePassword(password: string, hashpasswod: string) {
    const isMatch = await bycrpt.compare(password, hashpasswod);
    return isMatch;
  }

  async genrateToken(payload: { id: string, email: string }) {
    const token = await this.jwtservice.sign(payload, { secret: jwtSecret });
    return token;
  }
}
