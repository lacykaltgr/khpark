import {ObjectId, Schema, Document} from "mongoose";


export const EmployeeSchema = new Schema({
  name: String,
  email: String,
  password: String,
  status: [String],
  prev_ps: [{
    parking_space_id: {
      type: Schema.Types.ObjectId,
      ref: 'parking-space'
    },
    ps_count: Number,
  }],
  weekly_routine: [Number],
  plate_numbers: [{
    n: String,
    electric: Boolean
  }],
  reservations: [{
      type: Schema.Types.ObjectId,
      ref: 'reservation'
  }],
  arrival_habits: [Number],
  departure_habits: [Number],
  has_priority: Boolean,
});

export interface Employee extends Document {
  employee_id: ObjectId;
  name: string;
  email: string;
  password: string;
  status: string;
  prev_parking_spaces: [{
    parking_space_id: ObjectId,
    parking_count: number,
  }];
  weekly_routine: [number];
  plate_numbers: [{
    n: string,
    electric: boolean,
  }];
  reservations: [ObjectId],
  waitlists: [Date],

  arrival_time: number,
  departure_time: number,
  has_priority: boolean,
}
