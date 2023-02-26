import { Controller, Get, HttpException, HttpStatus, Session, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "../auth/utils/local.auth.guard";
import { Employee } from "./employee.model";
import { EmployeeService } from "./employee.service";
import { ReservationService } from "../reservation/reservation.service";

@Controller('employee')
export class EmployeeController {

  constructor(
    private readonly userService: EmployeeService,
    private readonly reservationService: ReservationService
  ) {
  }

  @UseGuards(AuthenticatedGuard)
  @Get('current')
  async getMe(
      @Session() session: Record<string, any>
  ) : Promise<Employee> {
      const me = await this.userService.getUserById(session.user.id);
      if (!me)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      return me;
  }

  @Get('all')
  async getAllEmployees() {
    const employees = await this.userService.getAllEmployees();
    const employees_formatted = employees.map(e => {
      return {
        fullname: e.name,
        email: e.email,
        license_plates: e.plate_numbers,
      }
    })
    return {
      message: "Successful request",
      data: employees_formatted
    }
  }

  @Get('schedule')
  async getEmployeeSchedule(
    @Session() session: Record<string, any>
  ) {
    const user = await this.userService.getUserById(session.user.id);
    let user_reservations = [];
    for (const reservation_id of Object.values(user.reservations)) {
      const reservation = await this.reservationService.getReservationById(reservation_id);
      user_reservations.push(reservation);
    }
    return {
      message: "Successful request",
      data: {
        reservations: user_reservations,
        waitlists: user.waitlists,
        //bekerülsz e addigra
        hasPriority: user.has_priority,
      }
    }
  }


}
