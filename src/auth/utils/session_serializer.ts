import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { EmployeeService } from "../../employee/employee.service";
import { Employee } from "../../employee/employee.model";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly userService: EmployeeService
  ) {
    super();
  }

  serializeUser(user: Employee, done: (err, user) => void) {
    done(null, user.id);
  }

  async deserializeUser(user_id: ObjectId, done: (err, user) => void) {
    const userDB = await this.userService.getUserById(user_id);
    return userDB ? done(null, userDB) : done(null, null)
  }

}