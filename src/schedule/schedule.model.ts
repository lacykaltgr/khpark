import {ObjectId, Schema, Document} from "mongoose";

export const ScheduleSchema = new Schema({
  week_first_day_date: Date,
  available: [Number],
  availability_stats: [Number],
  parking_spaces: [
    {
        type: Schema.Types.ObjectId,
        ref: 'reservation'
    }
  ],
  waitlist: [[{
    type: Schema.Types.ObjectId,
    ref: 'employee'
  }]],
  priority_waitlist: [[{
    type: Schema.Types.ObjectId,
    ref: 'employee'
  }]],
  waitlist_count: [],
})

export interface Schedule extends Document {
  week_first_day_date: Date;
  available: [number];
  availability_stats: [number];
  parking_spaces: [ObjectId],
  waitlist: [[ObjectId]],
  priority_waitlist: [[ObjectId]],
  waitlist_count: [],
}