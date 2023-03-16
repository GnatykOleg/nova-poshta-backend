export interface IDepartmentsCheckCityResponseData {
  Description: string;
  DescriptionRu: string;
  Ref: string;
  Delivery1: string;
  Delivery2: string;
  Delivery3: string;
  Delivery4: string;
  Delivery5: string;
  Delivery6: string;
  Delivery7: string;
  Area: string;
  SettlementType: string;
  IsBranch: string;
  PreventEntryNewStreetsUser: string;
  CityID: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  SpecialCashCheck: number;
  AreaDescription: string;
  AreaDescriptionRu: string;
}

export interface IСreateAndAddToDBResponseData {
  Description: string;
  CityDescription: string;
  Phone: string;
  Ref: string;
  Number: string;
  CityRef: string;
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  [key: string]: string | boolean | object;
}

export interface IResponseNP<D> {
  data: Array<D>;
  success: boolean;
  errors: Array<string> | [];
  warnings: Array<string> | Array<{ [key: string]: string }>;
  info: { totalCount: number };
  messageCodes: [];
  errorCodes: Array<string> | [];
  warningCodes: [];
  infoCodes: [];
}

export type QueryParams = {
  city: string;
  page: string;
};
