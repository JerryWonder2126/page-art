export interface IDBResponse {
  rows: any[];
}

export interface IDBErrorResponse {
  error: string;
}

export interface IParsedResponse {
  rows: any[];
  error: string;
}

export interface IUser {
  email: string;
  password: string;
  token: string;
}

export interface IAuthToken {
  authenticated: boolean;
}

export interface IOffer {
  title: string;
  short_description?: string;
  long_description?: string;
  price?: number;
  section_hash: string;
  artist?: string;
  medium?: string;
  year?: number;
  // year = body.year ? body.year : presentYear.getFullYear();
  dimension?: string;
  orientation?: string;
  status: 'on sale';
}

export interface IAuthDetails {
  email: string;
  password: string;
}
