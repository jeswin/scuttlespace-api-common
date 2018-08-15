import { CallResult, IData, IError } from "standard-api";
export { ICallContext } from "standard-api";

export interface IScuttlespaceError {
  code: string;
  message: string;
}

export type ServiceResult<T> = CallResult<T, IScuttlespaceError>;

export class ValidResult<T> implements IData<T> {
  type: "data";
  data: T;

  constructor(data: T) {
    this.type = "data";
    this.data = data;
  }
}

export class ErrorResult implements IError<IScuttlespaceError> {
  type: "error";
  error: IScuttlespaceError;

  constructor(error: IScuttlespaceError) {
    this.type = "error";
    this.error = error;
  }
}

export class ServiceResultParseError {
  tag?: string;
  code: string;
  message: string;

  constructor(tag: string | undefined, code: string, message: string) {
    this.tag = tag;
    this.code = code;
    this.message = message;
  }
}

export async function parseServiceResult<T>(
  serviceResult: ServiceResult<T> | Promise<ServiceResult<T>>,
  errorTag?: string
): Promise<T> {
  const result = await serviceResult;
  if (result.type === "data") {
    return result.data;
  } else {
    throw new ServiceResultParseError(
      errorTag,
      result.error.code,
      result.error.message
    );
  }
}

export interface IDbConfig {
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
}
