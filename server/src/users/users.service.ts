import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDTO: RegisterUserDTO) {
    // check if user already exists
    const potentialUser = await this.userRepo.findOneBy({
      email: registerUserDTO.email,
    });
    if (potentialUser) throw new HttpException('User Already Exists', 409);

    // hash the password
    registerUserDTO.password = await bcrypt.hash(registerUserDTO.password, 10);

    // register the new user
    const newUser = this.userRepo.create(registerUserDTO);
    await this.userRepo.save(newUser);

    // sign in the user (send access token)
    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    let full_name =
      registerUserDTO.first_name + ' ' + registerUserDTO.last_name;

    full_name = full_name.replace(/\b\w/g, (l) => l.toUpperCase());

    this.sendVerificationEmail(registerUserDTO.email, full_name, access_token);

    return {
      message: 'User successfully registered.',
      access_token,
      expires_in: 60 * 60,
    };
  }

  async login(loginUserDTO: LoginUserDTO) {
    // check if user already exists
    const existingUser = await this.userRepo.findOneBy({
      email: loginUserDTO.email,
    });
    if (!existingUser) throw new NotFoundException('User does not exist');

    // hash the password
    const isRightPassword = await bcrypt.compare(
      loginUserDTO.password,
      existingUser.password,
    );
    if (!isRightPassword) throw new UnauthorizedException('Wrong password');

    /* Create a jwt token and send it */
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };
    // this.sendVerificationEmail(loginUserDTO.email);
    // const token = await this.jwtService.signAsync(payload);
    // return token;
    return {
      message: 'User successfully logged in.',
      access_token: await this.jwtService.signAsync(payload),
      expires_in: 60 * 60,
    };
  }
  async getUserData(email: string) {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
      select: [
        'id',
        'role',
        'email',
        'first_name',
        'last_name',
        'profile_picture',
        'address',
        'phone_number',
      ],
    });
    return user;
  }

  async verifyEmail(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    if (!payload) {
      throw new UnauthorizedException();
    }
    // TODO: SAVE IN DB THAT EMAIL IS VERIFIED
    return {
      message: 'Email verified successfully.',
    };
  }

  private async sendVerificationEmail(
    email: string,
    full_name: string,
    access_token: string,
  ): Promise<void> {
    // TODO: Remove email overriding in production
    email = 'saifashrafhelmy@yahoo.com';
    try {
      const SERVER_LINK = this.configService.get<string>('SERVER_LINK');
      const ver_link = `${SERVER_LINK}\\users\\verify\\${access_token}`;
      await this.mailerService.sendMail({
        to: email, // list of receivers
        subject: 'Verify your Booktopia Email ✔', // Subject line
        text: 'Online Bookstore Login Notification', // plaintext body
        template: 'email_verification',
        context: {
          // Data to be sent to template engine. (access with locals.variableName)
          ver_link,
          full_name,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not send email', 500);
    }
  }
  // TODO: implement reset password with email
}
