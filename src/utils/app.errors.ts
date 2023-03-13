class AppErrorHandler extends Error {
  isOperational: boolean;
  statusCode: number;
  status: string;
  _message: any;
  kind: any;
  path: any;
  value:any;
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fail!" : "Error!!";
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppErrorHandler;
