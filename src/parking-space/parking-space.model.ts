import {ObjectId, Schema, Document} from "mongoose";
import { SchedulerAction } from "rxjs";
import { Get } from "@nestjs/common";


export const ParkingSpaceSchema = new Schema({
  parking_spaces: [{
    in_building_id: Number,
    ps_owner: {
      type: Schema.Types.ObjectId,
      ref: 'employee'
    },
    location: String,
    electric: Boolean,
  }]
});

export interface ParkingSpaces extends Document {
  id: ObjectId;
  parking_spaces: [ParkingSpace];
}

export interface ParkingSpace {
  id: ObjectId;
  in_building_id: number;
  ps_owner: ObjectId;
  electric: boolean;
}