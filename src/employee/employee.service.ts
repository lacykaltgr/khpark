import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Employee } from "./employee.model";
import {ObjectId, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { Reservation } from "../reservation/reservation.model";




@Injectable()
export class EmployeeService {

  constructor(
    @InjectModel('employee') private readonly employeeModel: Model<Employee>,) {
  }
  
  async getUserByEmail(email: string ): Promise<Employee> {
    const employee = await this.employeeModel.findOne({ email }).exec();
    return employee;
  }

  async getUserById(id: ObjectId) : Promise<Employee> {
    const employee = this.employeeModel.findById(id).exec();
    return employee
  }

  async addReservations(reservations: ObjectId[], user: ObjectId) {
    const update = this.employeeModel.findByIdAndUpdate(
              user,
      { $push: { reservations: { $each: reservations } } })
    return update;
  }

  async addWaitlist(dates: Date[], user: ObjectId) {
    const update = this.employeeModel.findByIdAndUpdate(
      user,
      { $push: { reservations: { $each: dates } } ,
        $set: { has_priority: false }});
    return update;
  }

  async getAllEmployees() : Promise<Employee[]> {
    const employees = await this.employeeModel.find();
    return employees;
  }

  async isEmployeeElectric(id: ObjectId) : Promise<boolean> {
    const employee = await this.employeeModel.findById(id);
    return employee.plate_numbers[0].electric;
  }

}
