import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Auth Service');

  constructor(
    private readonly jwtService: JwtService
  ){
    super()
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('MongoDB connected');
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    try {
      
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        user: user,
        token: await this.signJWT(user),
      }

    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 401,
        message: 'Invalid token'
      })
    }

  }
  
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, username } = registerUserDto;
    try {

      const userExists = await this.user.findUnique({
        where: {
          email: email
        }
      });

      if(userExists) {
        throw new RpcException({
          status: 400,
          message: 'User already exists'
        })
      }

      const user  = await this.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 10),
          username: username
        }
      })

      const { password: __, ...rest } = user;
      
      return {
        user: rest,
        token: await this.signJWT(rest),
      }
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {

      const user = await this.user.findUnique({
        where: {
          email: email
        }
      });

      if(!user) {
        throw new RpcException({
          status: 400,
          message: 'User or password incorrect'
        })
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if(!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid'
        })
      }

      const { password: __, ...rest } = user;
      
      return {
        user: rest,
        token: await this.signJWT(rest),
      }
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }
}
