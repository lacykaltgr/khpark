import { ObjectId } from "mongoose";

export class ReservationDto {
  date: Date;
}

export class GiveupDto {
  date: Date;
  toSpecific: ObjectId;
}