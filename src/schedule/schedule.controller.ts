import { Body, Controller, Get, HttpException, HttpStatus, Post, Session } from "@nestjs/common";
import { GiveupDto, ReservationDto } from "./schedule.validation";
import * as readline from "readline";
import { ScheduleService } from "./schedule.service";
import { EmployeeService } from "../employee/employee.service";
import { ReservationService } from "../reservation/reservation.service";

@Controller('schedule')
export class ScheduleController {

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly userService: EmployeeService,
    private readonly reservationService: ReservationService,
    private readonly employeeService: EmployeeService
  ) {}


  @Get('week_availability')
  async getWeekAvailability(
    @Body() date: Date
  ) {
    const week_schedule = await this.scheduleService.getThisWeek(date)
    return week_schedule.available
  }

  @Post('reserve')
  async requestParkingSpace(
    @Body() reservation: ReservationDto,
    @Session() session: Record<string, any>
  ) {
    const week_schedule = await this.scheduleService.getThisWeek(reservation.date);
    const day_n =  Math.floor((reservation.date.valueOf() - week_schedule.week_first_day_date.valueOf()) / (1000 * 60 * 60 * 24));
    if (week_schedule.available[day_n] > 0) {
      const isElectric = await this.userService.isEmployeeElectric(session.user.id);
      const reserved_space = await this.reservationService.reserveParkingSpace(session.user.id, reservation.date, isElectric)
      if (reserved_space){
        const availability = this.scheduleService.increaseAvailability(reservation.date, -1);
        const updatedEmloyee = await this.employeeService.addReservations([reserved_space.id], session.user.id);
        return {
          message: "Successfully reserved parking space",
          data: reserved_space,
        }
      }
      else throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      const employee = await this.employeeService.getUserById(session.user.id);
      const waitlist_status = this.scheduleService.putOnWaitlist(session.user.id, reservation.date, employee.has_priority);
      const updatedEmployee = await this.employeeService.addWaitlist([reservation.date], session.user.id);
      return {
        message: "You are on the waitlist",
        data: waitlist_status
      }
    }
  }

  @Post('giveup')
  async giveUpParkingSpace(
    @Body() giveup: GiveupDto,
    @Session() session: Record<string, any>
  ) {
    const reservation = this.reservationService.hasReservation(giveup.date, session.user.id);
    if (!reservation)
      return {
        message: "No reservation",
        data: null
      }
    const giveup_status = this.reservationService.giveUpParkingSpace(giveup.date, session.user.id, giveup.toSpecific);
    await this.scheduleService.increaseAvailability(giveup.date, 1);
    return {
      message: giveup_status ? "Successful giveup" : "Unsuccessful giveup",
      data: giveup_status
    }
  }
}
