import HttpStatusCode from "../utils/enum/httpStatusCode";

export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}


export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}


export class ConflictEror extends ApiError {
  constructor(message: string) {
    super(message, HttpStatusCode.CONFLICT);
  }
}

  
  

