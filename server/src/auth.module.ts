import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret =
          configService.get<string>('JWT_SECRET') || 'j4234j23DS$';
        // console.log(`JWT_SECRET from configService: ${jwtSecret}`); // Log the JWT secret
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '1hr' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
