import { Injectable } from '@nestjs/common';
import { Employee } from "../employee/employee.model";
import { ReservationDto } from "../schedule/schedule.validation";
import { Schedule } from "../schedule/schedule.model";
import { Reservation, ReservationSchema } from "../reservation/reservation.model";
import { ParkingSpace, ParkingSpaces } from "../parking-space/parking-space.model";
import {ObjectId, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { ParkingSpaceService } from "../parking-space/parking-space.service";
import { EmployeeService } from "../employee/employee.service";
import { createObjectCsvWriter } from 'csv-writer';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ControllerService {

  constructor(
    @InjectModel('reservations') private readonly reservationsModel: Model<Reservation>,
    @InjectModel('schedule') private readonly scheduleModel: Model<Schedule>,

    @InjectModel('employee') private readonly employeeModel: Model<Employee>,
    private readonly parkingSpaceService: ParkingSpaceService,
    private readonly employeeService: EmployeeService
  ) {
  }

  async generateWeek(date: Date) {

    let reservation_ids = [];

    const parking_spaces = await this.parkingSpaceService.getParkingSpaces();
    for (const parking_space of Object.values(parking_spaces.parking_spaces)) {
      const employee = await this.employeeService.getUserById(parking_space.ps_owner);
      const employee_need = [0,0,0,1,1,0,0];
      const employee_reservations = [];
      for (let i = 0; i < 7; i++) {
        const reservation = new this.reservationsModel({
          date: date.setDate(date.getDate() + i),
          ps_id: parking_space.id,
          user: employee_need[i] == 1 ? employee.employee_id : null,
          arrival: null,
          departure: null,
        });
        const reservation_object = await reservation.save();
        reservation_ids.push(reservation_object.id);
        employee_reservations.push(reservation_object);
      }
      await this.employeeService.addReservations(employee_reservations, employee.employee_id)
    }

    const schedule = new this.scheduleModel({
      week_first_day_date: date,
      available: Array(7).fill(2000),
      parking_spaces: reservation_ids,
      waitlist: [[]],
      priority_waitlist: [[]]
    });

    const updated_employee_priority = await this.employeeModel.updateMany({}, {
      $set: {
        has_priority: true
      }
    });

    const savedSchedule = await schedule.save();
    return savedSchedule;
  }

  async archiveWeek(date: Date) {
    const schedule = await this.scheduleModel.findOne({date});
    const row = {};
    row['date'] = date;
    for (let i = 0; i < 2*12*5; i++) row[i.toString() + "_availability"] = schedule.availability_stats[i];
    for (let i = 0; i < 2*12*5; i++) row[i.toString() + "_waitlist_count"] = schedule.waitlist_count[i];
    const csv_schedule = createObjectCsvWriter({
      path: '../../data/schedule.csv',
      header: [],
      append: true,
    });
    await csv_schedule.writeRecords([row]);

    const reservations = await this.reservationsModel.find({
      date: {
        $gte: date,
        $lt: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const arrivals = await this.reservationsModel.aggregate([
      {
        $match: {
          arrival_time: { $nin: [null, 0],},
          departure_time: { $nin: [null, 0],}
        },
      },
      {
        $group: {
          _id: '$user',
          avgArrivalTime: { $avg: '$arrival_time' },
          avgDepartureTime: { $avg: '$departure_time' },
        },
      },
    ]);

    for (let a of Object.values(arrivals)) {
      await this.employeeModel.updateOne(
        { _id: a.userId },
        {
          $set: {
            arrival_time: a.avgArrivalTime,
            departure_time: a.avgDepartureTime,
          },
        }
      );
    }

    const csv_reservation_file = createObjectCsvWriter({
      path: '../../date/reservation.csv',
      header: [],
      append: true
    });
    await csv_reservation_file.writeRecords(reservations)
  }


  async readCsvFile(filepath: string) {
    const results = [];

    const stream = fs.createReadStream(filepath)
      .pipe(csvParser());

    for await (const row of stream) {
      results.push(row);
    }

    return results;
  }


  async updateEmployee(id: ObjectId, arrival: Date, departure: Date, ps: ObjectId) {
    let updateData: any = {};

    if (!ps) {
      updateData.departure_time = departure;
    } else {
      updateData.arrival_time = arrival;
      updateData.$inc = { [`prev_ps.${ps}`]: 1 };
    }

    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateData, { new: true });
    return updatedEmployee;
  }


  //functions for generated users
  async removeAllGeneratedEmployees() {
    const empty = await this.employeeModel.deleteMany();
    return empty;
  }

  async createGeneratedEmployee(employee: any) {
    const saltOrRounds = 2;
    const hashedPassword = await bcrypt.hash(employee['name'], saltOrRounds);
    let status = []
    for (let i = 1;i > 364; i++) {
      status.push(employee[i.toString()])
    }
    let plate_numbers = [];
    for (let i = 0; i > employee.plate_numbers; i++) {
      plate_numbers.push(this.generatePlateNumber())
    }
    const newUser = new this.employeeModel({
      name: employee['name'],
      email: employee['email'],
      password: hashedPassword,
      status: status,
      prev_parking_spaces: [],
      weekly_routine: [],
      plate_numbers,
      reservations: [],
      waitlists: [],
      arrival_habits: employee['arrival_time'],
      departure_habits: employee['departure_time'],
      has_priority: true,
    })
    newUser.save();
  }

  generatePlateNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let region = '';
    let type = '';
    let numPart = '';
    for (let i = 0; i < 2; i++) {
      region += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    type = chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 3; i++) {
      numPart += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    const plateNum = `${region}-${type}-${numPart}`;
    return plateNum;
  }



}
