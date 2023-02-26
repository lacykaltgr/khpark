import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./auth.validation";
import { Employee } from "../employee/employee.model";
import {InjectModel} from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { EmployeeService } from "../employee/employee.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly employeeService: EmployeeService,
        @InjectModel('employee') private readonly employeeModel: Model<Employee>
    ) {}

    async createUser(user: CreateUserDto): Promise<Employee> {
        const isEmailUnique = await this.isEmailUnique(user.email);
        if (!isEmailUnique)
            throw new HttpException("There is already an account with this email address", HttpStatus.CONFLICT);
        const newUser = new this.employeeModel({
            name: user.fullname,
            email: user.email,
            password: user.password,
            status: [],
            prev_parking_spaces: [],
            weekly_routine: [],
            plate_numbers: [],
        })
        await newUser.save();
        return newUser;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.employeeService.getUserByEmail(email);
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)

        if (!user)
            throw new NotAcceptableException('could not find the user');
        if (user && passwordValid)
            return user;

        return null;
    }

    async isEmailUnique(email: string) : Promise<boolean> {
        const user_with_email = await this.employeeModel.findOne({email});
        return !user_with_email;
    }

}
