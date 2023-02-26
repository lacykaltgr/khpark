import { Module } from '@nestjs/common';
import { EmployeeSchema } from "../employee/employee.model";
import { EmployeeController } from "../employee/employee.controller";
import { EmployeeService } from "../employee/employee.service";
import { ControllerService } from "./controller.service";
import { ControllerController } from "./controller.controller";
import { ParkingSpaceService } from "../parking-space/parking-space.service";
import { ScheduleSchema } from "../schedule/schedule.model";
import { ReservationSchema } from "../reservation/reservation.model";
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationService } from "../reservation/reservation.service";
import { ParkingSpaceSchema } from "../parking-space/parking-space.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'schedule', schema: ScheduleSchema},
      {name: 'reservations', schema: ReservationSchema},
      {name: 'parking-space', schema: ParkingSpaceSchema},
      {name: 'employee', schema: EmployeeSchema}])
  ],
  controllers: [ControllerController],
  providers: [ControllerService, ParkingSpaceService, EmployeeService, ReservationService]
})
export class ControllerModule {}
