import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from './schedule/schedule.module';
import { ControllerModule } from './controller/controller.module';
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    AuthModule,
    EmployeeModule,
    MongooseModule.forRoot(
      "mongodb+srv://freundl0509:HlU5wa4YT08Z5VFe@parkingapp.avuc3er.mongodb.net/?retryWrites=true&w=majority",
    ),
    ScheduleModule,
    ControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
