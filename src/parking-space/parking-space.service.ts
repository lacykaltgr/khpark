import { Injectable } from '@nestjs/common';
import { Employee } from "../employee/employee.model";
import { ParkingSpace, ParkingSpaces } from "./parking-space.model";
import {ObjectId, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class ParkingSpaceService {

  constructor(
    @InjectModel('parking-space') private readonly parkingSpaceModel: Model<ParkingSpaces>,
  ) {}


  async getParkingSpaces() : Promise<ParkingSpaces> {
    const parking_spaces = await this.parkingSpaceModel.findOne()
    return parking_spaces
  }

  async getElectricParkingSpaces() : Promise<ParkingSpace[]> {
    const parking_spaces = await this.parkingSpaceModel.findOne();
    const electric = parking_spaces.parking_spaces.filter(v => v.electric);
    return electric
  }

}
