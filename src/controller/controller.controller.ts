import { Body, Controller, Get, Post } from "@nestjs/common";
import { DateDto } from "./controller.validation";
import { ControllerService } from "./controller.service";
import * as fs from 'fs';
import { ObjectId } from "mongoose";
import { ReservationService } from "../reservation/reservation.service";
import * as path from "path";
//import * as xgboost from 'xgboost';


@Controller('controller')
export class ControllerController {

  constructor(
    private readonly controllerService: ControllerService,

    private readonly reservationService: ReservationService
  ) {}


  @Post('generate-next-week')
  async generateNextWeek(
  ) {
    const filePath = 'data/scheduler.json';
    const file = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(file);
    const lastGeneratedWeek = new Date(data.last_generated);
    const lastArchived = new Date(data.last_archived);
    const newGeneration = new Date(lastGeneratedWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newArchive = new Date(lastArchived.getTime() + 7 * 24 * 60 * 60 * 1000);
    const generate = await this.controllerService.generateWeek(newGeneration)
    const archive = await this.controllerService.archiveWeek(newArchive)
    return {
      message: "Successfully generated week",
      data: { generate, archive }
    }
  }


  @Get('stats')
  async getWeekStats(
    @Body() date: DateDto
  ) {
    return null;
  }

  @Get('enter')
  async enter(
    @Body('employee_id') id: ObjectId,
    @Body('date') date: Date
  ) {
    const reservation = await this.reservationService.hasReservation(date, id);
    if (!reservation) return false;
    const updateEmployee = this.controllerService.updateEmployee(id, new Date(), null, reservation.ps_id);
    return true;
  }

  @Get('leave')
  async leave(
    @Body('employee_id') id: ObjectId,
    @Body('date') date: Date
  ) {
    const updateEmployee = this.controllerService.updateEmployee(id, null, new Date(), null);
    return null;
  }

/*
  @Post('predict')
  async predict(
    @Body() features_body: FeaturesDto,
    features_param: FeaturesDto
  ) {
    let features;
    if (features_body) {
      features = features_body ;
    } else if (features_param) {
      features = features_param;
    } else {
      return null;
    }
    const modelPath = 'path/to/your/model';
    const model = await xgboost.loadModel(modelPath);
    const inputMatrix = xgboost.DMatrix.fromArray([features]);
    const prediction = await model.predict(inputMatrix, features.keys);
    if (prediction == 0) return "H";
    else if (prediction == 1) return "V";
    else if (prediction == 2) return "W";
    return prediction;
  }

 */



  //function for generated users
  @Post('fill-generated-users')
  async fillWithGeneratedUsers() {
    const file = await this.controllerService.readCsvFile("/Users/laszlofreund/code/js/khpark/data/output.csv");
    const empty_employee_collection = await this.controllerService.removeAllGeneratedEmployees();
    for (const row of file) {
      const generatedEmployee = await this.controllerService.createGeneratedEmployee(row);
    }
  }



}
