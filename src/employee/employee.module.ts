import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from "./employee.model";
import { ReservationService } from "../reservation/reservation.service";
import { ReservationSchema } from "../reservation/reservation.model";
import { ParkingSpaceService } from "../parking-space/parking-space.service";
import { ParkingSpaceSchema } from "../parking-space/parking-space.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'employee', schema: EmployeeSchema},
      {name: 'reservations', schema: ReservationSchema},
      {name: 'parking-space', schema: ParkingSpaceSchema}])
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, ReservationService, ParkingSpaceService]
})
export class EmployeeModule {}
