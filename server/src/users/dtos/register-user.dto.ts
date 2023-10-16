import { IsOptional, IsString } from "class-validator";

export class RegisterUserDTO{
    // REQUIRED:
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    first_name: string;
    
    @IsString()
    last_name: string;


    // OPTIONAL STUFF
    
    @IsString()
    @IsOptional()
    profile_picture: string

    @IsString()
    @IsOptional()
    address: string

    @IsString()
    @IsOptional()
    phone_number: string

   
}