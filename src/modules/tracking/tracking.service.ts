import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Tracking, TrackingDocument } from './models/tracking.model';
import {
  CreateTrackingDataReturnType,
  IResponseNP,
} from './types/tracking.types';

@Injectable()
export class TrackingService {
  private NP_BASE_URL: string;
  private NP_API_KEY: string;

  // In the constructor, we initialize
  // trackingModel for working with MongoDB
  // configService to get environment variables
  // httpService for working with the Nova Poshta API
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<TrackingDocument>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // Set .env values to private values in Class TrackingService
    this.NP_BASE_URL = this.configService.get<string>('NP_BASE_URL');
    this.NP_API_KEY = this.configService.get<string>('NP_API_KEY');
  }

  // Here a request is made to the Nova Poshta API, where we get the data described in the interface IResponseNP
  private async getTrackingData(trackingNumber: string): Promise<IResponseNP> {
    const { data }: AxiosResponse<IResponseNP> = await firstValueFrom(
      this.httpService.post<IResponseNP>(this.NP_BASE_URL, {
        apiKey: this.NP_API_KEY,
        modelName: 'TrackingDocument',
        calledMethod: 'getStatusDocuments',
        methodProperties: {
          Documents: [{ DocumentNumber: trackingNumber }],
        },
      }),
    );
    return data;
  }

  // Creating a tracking data
  // Returns either the object or null declared in the type CreateTrackingDataReturn
  private async createTrackingData(
    trackingNumber: string,
  ): CreateTrackingDataReturnType {
    // Get data from getTrackingData method
    const { data } = await this.getTrackingData(trackingNumber);

    const {
      StatusCode,
      Status,
      WarehouseRecipient,
      Number,
      WarehouseSender,
      CityRecipient,
      CitySender,
    } = data[0];

    // Description of StatusCode from Nova Poshta API Docs:
    // "2" = "Видалено"
    // "3" = "Номер не знайдено"
    if (StatusCode === '3' || StatusCode === '2')
      throw new NotFoundException('ТТН з таким номером не знайдено в базі');

    return {
      Status,
      WarehouseRecipient,
      Number,
      WarehouseSender,
      CityRecipient,
      CitySender,
    };
  }

  // Main method for get tracking status in service
  async getTrackingStatusService(trackingNumber: string) {
    // 1.We are looking in the MongoDB database to see if we have data with an our DB that comes in trackingNumber
    const isTrackingNumberExist = await this.trackingModel.findOne({
      Number: trackingNumber,
    });

    // 2. If there is no data on such an our DB
    if (!isTrackingNumberExist) {
      // 2a. Create an invoice using the createTrackingData method
      const createdTracking = await this.createTrackingData(trackingNumber);

      // 2b. If the createdTracking method returned data to us, we create it in our database
      const resultOfCreateTrackingData = await this.trackingModel.create(
        createdTracking,
      );

      // 2с. In any case, we return resultOfCreateTrackingData,
      return resultOfCreateTrackingData;
    }

    // 3. If we have data about this invoice in our database

    // 3a. We create the invoice again, since its data could change, this is logical because the delivery status is changing
    const createdTracking = await this.createTrackingData(trackingNumber);

    // 3b. Update tracking data in our db
    const updatedTrackingData = await this.trackingModel.findByIdAndUpdate(
      isTrackingNumberExist.id,
      createdTracking,
      { new: true },
    );

    return updatedTrackingData;
  }
}
