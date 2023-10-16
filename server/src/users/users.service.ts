import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDTO: RegisterUserDTO) {
    // check if user already exists
    const potentialUser = await this.userRepo.findOneBy({
      email: registerUserDTO.email,
    });
    if (potentialUser) return new HttpException('User Already Exists', 409);

    // hash the password
    registerUserDTO.password = await bcrypt.hash(registerUserDTO.password, 10);

    // register the new user
    const newUser = this.userRepo.create(registerUserDTO);
    await this.userRepo.save(newUser);

    // sign in the user (send access token)
    const payload = { sub: newUser.id, email: newUser.email };
    return {
      message: 'User successfully registered.',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginUserDTO: LoginUserDTO) {
    // check if user already exists
    const existingUser = await this.userRepo.findOneBy({
      email: loginUserDTO.email,
    });
    if (!existingUser) return new HttpException('User does not exist', 404);

    // hash the password
    const isRightPassword = await bcrypt.compare(
      loginUserDTO.password,
      existingUser.password,
    );
    if (!isRightPassword) return new UnauthorizedException('Wrong password');

    /* Create a jwt token and send it */
    const payload = { sub: existingUser.id, email: existingUser.email };
    return {
      message: 'User successfully signed in.',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
