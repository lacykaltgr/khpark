import {AuthService} from "./auth.service";
import {
    Body,
    Controller,
    Get,
    Post,
    Session,
    UseGuards,
    UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/local.auth.guard';
import { SessionSerializer } from './utils/session_serializer';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./auth.validation";
import fs from "fs";
import * as csvParser from 'csv-parser';

@UseInterceptors(SessionSerializer)
@Controller('auth')
export class AuthController {

    constructor(
      private readonly authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login() {
        return { message: 'Successfully logged in.' };
    }


    @Post('logout')
    async logout(@Session() session: Record<string, any>) {
        session.destroy();
        return { message: 'Successfully logged out.' };
    }


    @UseGuards(AuthenticatedGuard)
    @Get('session')
    getMe(@Session() session: Record<string, any>) {
        return session;
    }

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async createUser(
      @Body() auth: CreateUserDto,
    ): Promise<any> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(auth.password, saltOrRounds);
        await this.authService.createUser({
            fullname: auth.fullname,
            password: hashedPassword,
            email: auth.email
        });
        return {
            message: "Successfully created user",
            fullname: auth.fullname,
        };
    }



}