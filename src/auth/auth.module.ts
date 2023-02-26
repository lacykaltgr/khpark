import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import {LocalStrategy} from "./utils/local.strategy";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthController} from "./auth.controller";
import { SessionSerializer } from './utils/session_serializer';
import { EmployeeModule } from "../employee/employee.module";
import { EmployeeService } from "../employee/employee.service";
import { EmployeeSchema } from "../employee/employee.model";


@Module({
  imports: [
      EmployeeModule,
      PassportModule.register(
        {
        session: true
        }),
    MongooseModule.forFeature([
      {name: 'employee', schema: EmployeeSchema}])

  ],
  providers: [
      AuthService,
      LocalStrategy,
      SessionSerializer,
      EmployeeService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
