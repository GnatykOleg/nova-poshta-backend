import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Department, DepartmentDocument } from './models/departments.model';
import {
  IDepartmentsCheckCityResponseData,
  IResponseNP,
  IСreateAndAddToDBResponseData,
  QueryParams,
} from './types/departments.types';

@Injectable()
export class DepartmentsService {
  private NP_BASE_URL: string;
  private NP_API_KEY: string;
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.NP_BASE_URL = this.configService.get<string>('NP_BASE_URL');
    this.NP_API_KEY = this.configService.get<string>('NP_API_KEY');
  }

  // Check if the city exists and get information about it
  private async checkCityAndGetCityInfo(
    city: string,
  ): Promise<IDepartmentsCheckCityResponseData | null> {
    const {
      data: { data },
    }: AxiosResponse<IResponseNP<IDepartmentsCheckCityResponseData>> =
      await firstValueFrom(
        this.httpService.post(this.NP_BASE_URL, {
          apiKey: this.NP_API_KEY,
          modelName: 'Address',
          calledMethod: 'getCities',
          methodProperties: {
            FindByString: city,
          },
        }),
      );

    // An array is received by matches in the FindByString method
    // If no such city is found, throw error, and code stopped
    if (data.length === 0)
      throw new NotFoundException(`Такого міста не існує: ${city}`);

    // If city true Filter the array for an exact match
    //  Because the search algorithm does not always return an exact match
    // We also take into account that the user can send a city
    // both in Russian and Ukrainian
    const filteredFindCityResponse = data.find(
      ({ DescriptionRu, Description }) =>
        DescriptionRu.toLowerCase() === city.toLowerCase() ||
        Description.toLowerCase() === city.toLowerCase(),
    );

    //The live search algorithm, when you enter "Че",
    // will return an array of matches = "Чермалык" and "Черкасы" and so on,
    // so we add a error if not city
    if (!filteredFindCityResponse)
      throw new NotFoundException(`Такого міста не існує: ${city}`);

    return filteredFindCityResponse;
  }

  // Retrieve the necessary data in order to save only the necessary values ​​to the database
  private filtedDataToSave(data: IResponseNP<IСreateAndAddToDBResponseData>) {
    return data.data.map(
      ({
        CityDescription,
        CityRef,
        Description,
        Number,
        Phone,
        Ref,
        Schedule,
      }) => {
        // Translate day of weeks
        const daysOfWeek = {
          Monday: 'Понеділок',
          Tuesday: 'Вівторок',
          Wednesday: 'Середа',
          Thursday: 'Четвер',
          Friday: "П'ятниця",
          Saturday: 'Субота',
          Sunday: 'Неділя',
        };

        const translatedSchedule = {};
        for (const [day, time] of Object.entries(Schedule)) {
          translatedSchedule[daysOfWeek[day]] = time;
        }
        return {
          CityDescription,
          CityRef,
          Description,
          Number,
          Phone,
          Ref,
          Schedule: translatedSchedule,
        };
      },
    );
  }

  // Create a document with departments and save it to the database
  private async createAndAddToDB({ city, page }: QueryParams) {
    const { data }: AxiosResponse<IResponseNP<IСreateAndAddToDBResponseData>> =
      await firstValueFrom(
        this.httpService.post(this.NP_BASE_URL, {
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityName: city,
            Page: page,
            Limit: '12',
          },
        }),
      );

    // If page not exist we throw error
    if (data.data.length === 0)
      throw new NotFoundException(`Неіснуючий номер сторінки: ${page}`);

    const { CityDescription, CityRef } = data.data[0];

    // Retrieve the necessary data in order to save only the necessary values ​​to the database
    const filteredData = this.filtedDataToSave(data);

    // Create a document with the required search fields
    const createdDepartments = await this.departmentModel.create({
      CityName: CityDescription,
      CityRef,
      Departments: filteredData,
      Page: page,
      TotalCountForCity: data.info.totalCount,
    });

    return createdDepartments;
  }

  async getDepartmentsService({ city, page }: QueryParams) {
    // 1. Check if such a city exists
    // 1a. If city false throw error, if true continue
    const checkedCity = await this.checkCityAndGetCityInfo(city);

    // 2. We are looking for a document in the database by CityRef and page
    const findDataByQuery = await this.departmentModel.findOne({
      CityRef: checkedCity.Ref,
      Page: page,
    });

    // 3. If we do not find such a document, then we create it
    // If we find it, then return it in the response from our DB

    return !findDataByQuery
      ? await this.createAndAddToDB({ city, page })
      : findDataByQuery;
  }
}
