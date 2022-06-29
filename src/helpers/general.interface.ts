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
