// Set need values, and other values
interface ITrackingResponseDataNP {
  StatusCode: string;
  Status: string;
  WarehouseRecipient: string;
  Number: string;
  WarehouseSender: string;
  CityRecipient: string;
  CitySender: string;
  [key: string]: string | boolean | object;
}

export interface IResponseNP<T = []> {
  data: Array<ITrackingResponseDataNP>;
  success: boolean;
  errors: Array<string> | [];
  warnings: Array<string> | Array<{ [key: string]: string }>;
  info: T;
  messageCodes: [];
  errorCodes: Array<string> | [];
  warningCodes: [];
  infoCodes: [];
}

export type CreateTrackingDataReturnType = Promise<{
  Status: string;
  WarehouseRecipient: string;
  Number: string;
  WarehouseSender: string;
  CityRecipient: string;
  CitySender: string;
}>;
