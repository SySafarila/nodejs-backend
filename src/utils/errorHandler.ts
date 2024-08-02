import Joi from "joi";
import CustomError from "./CustomError";

const errorHandler = (error: any): { code: number; message: string } => {
  let code: number | undefined = undefined;
  let message: string | undefined = undefined;

  if (error instanceof Joi.ValidationError) {
    code = 400;
    message = error.message;
  }

  if (error instanceof CustomError) {
    code = error.code;
    message = error.message;
  }

  // console.error(error.message ?? "Internal server error");

  return {
    code: code ?? 500,
    message: message ?? "Internal server error",
  };
};

export default errorHandler;
