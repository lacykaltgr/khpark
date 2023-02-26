import {ObjectId, Schema, Document} from "mongoose";

export const ReservationSchema = new Schema({
    date: Date,
    ps_id: {
      type: Schema.Types.ObjectId,
      ref: 'parking-space'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'employee'
    },
    arrival: Date,
    departure: Date,
  }
)

export interface Reservation extends Document {
  date: Date,
  ps_id: ObjectId,
  user: ObjectId,
  arrival: Date,
  departure: Date,
}