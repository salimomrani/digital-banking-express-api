export default class HttpException extends Error {
  statusCode: number;

  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
