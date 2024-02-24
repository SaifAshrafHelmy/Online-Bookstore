import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDTO: RegisterUserDTO) {
    return this.usersService.register(registerUserDTO);
  }

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO) {
    return this.usersService.login(loginUserDTO);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getUserData(req.user?.email);
    return req.user?.email;
  }

  // TODO Make a route to verify email

  @Get('/verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  // no logout route needed, client should remove the token from localStorage or cookie
}
