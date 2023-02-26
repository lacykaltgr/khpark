import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Reservation } from "./reservation.model";
import { ParkingSpaceService } from "../parking-space/parking-space.service";

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel('reservations') private readonly reservationsModel: Model<Reservation>,
    private readonly parkingSpaceService: ParkingSpaceService
  ) {}

  async getReservationsByDay(date: Date) : Promise<Reservation[]> {
    const reservations = await this.reservationsModel.find({date});
    return reservations;
  }

  async getReservationById(r_id: ObjectId) : Promise<Reservation> {
    const reservations = await this.reservationsModel.findById(r_id);
    return reservations;
  }

  async hasReservation( date: Date, user: ObjectId) : Promise<Reservation> {
    const reservation = await this.reservationsModel.findOne({date, user});
    return reservation;
  }



  //TODO ismert parkolókba dobjon
  async reserveParkingSpace(user_id: ObjectId, date: Date, isElectric: boolean) : Promise<Reservation>  {

    const electric_ps = await this.parkingSpaceService.getElectricParkingSpaces();
    if (isElectric) {
      const updatedReservation = await this.reservationsModel.findOneAndUpdate(
          { date, ps_id: { $in: electric_ps}, user: null},
        { $set: { user : user_id } },
        { new: true },
      );
      if (updatedReservation) {
        return updatedReservation;
      }
    } else {
      const updatedReservation = await this.reservationsModel.findOneAndUpdate(
        { date, ps_id: { $nin: electric_ps}, user: null},
        { $set: { user : user_id } },
        { new: true },
      );
      if (updatedReservation) {
        return updatedReservation;
      }
    }
    const updatedReservation = await this.reservationsModel.findOneAndUpdate(
        { date, user: null },
      { $set: { user : user_id } },
      { new: true },
    );
    return updatedReservation;
  }

  async giveUpParkingSpace(date: Date, user: ObjectId, toSpecific: ObjectId) {
    const updatedReservation = await this.reservationsModel.findOneAndUpdate(
        { date, user },
      { $set: { user: toSpecific } },
      { new: true },
    );
    return updatedReservation;
  }
}
