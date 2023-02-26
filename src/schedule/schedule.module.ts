import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { EmployeeSchema } from "../employee/employee.model";
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from "./schedule.model";
import { EmployeeService } from "../employee/employee.service";
import { ReservationService } from "../reservation/reservation.service";
import { ReservationSchema } from "../reservation/reservation.model";
import { ParkingSpaceService } from "../parking-space/parking-space.service";
import { ParkingSpaceSchema } from "../parking-space/parking-space.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'schedule', schema: ScheduleSchema},
      {name: 'employee', schema: EmployeeSchema},
      {name: 'reservations', schema: ReservationSchema},
      {name: 'parking-space', schema: ParkingSpaceSchema}])
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, EmployeeService, ReservationService, ParkingSpaceService]
})
export class ScheduleModule {}
