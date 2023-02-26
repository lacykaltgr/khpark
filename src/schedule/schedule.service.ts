import { Injectable } from '@nestjs/common';
import { Employee } from "../employee/employee.model";
import {InjectModel} from "@nestjs/mongoose";
import {ObjectId, Model} from "mongoose";
import { Schedule }  from './schedule.model'
import { ParkingSpace } from "../parking-space/parking-space.model";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('schedule') private readonly scheduleModel: Model<Schedule>,) {
  }

  async getThisWeek(date: Date) : Promise<Schedule> {
    const week_date = this.getFirstDateOfWeek(date);
    const schedule = await this.scheduleModel.findOne({week_first_day_date: week_date});
    return schedule;
  }

  async putOnWaitlist(user_id: ObjectId, date: Date, priority: boolean) {
    const schedule = await this.scheduleModel.findOne({
      week_first_day_date: date,
    });

    const index = date.getDay();
    if (priority) schedule.priority_waitlist[index].push(user_id);
    else schedule.waitlist[index].push(user_id);
    return schedule.save();
  }

  getFirstDateOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }


  async increaseAvailability(date: Date, inc_v: number) {
    const updatedSchedule = await this.scheduleModel.findOneAndUpdate(
      { week_first_day_date: { $lte: date } },
      { $inc: { [`available.${date.getDay()}`]: inc_v } },
      { new: false },
    );
    if (!updatedSchedule.priority_waitlist[date.getDay()]) {
      if (updatedSchedule.available[date.getDay()] == 1) {
        if (updatedSchedule.priority_waitlist[date.getDay()].length.toString() == '0') {
          const user_id = updatedSchedule.waitlist[date.getDay()].pop()
        } else {
          const user_id = updatedSchedule.priority_waitlist[date.getDay()].pop();
        }
      }
    }


  }

}
