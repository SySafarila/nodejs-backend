import { Response } from "express";

interface ResponseType extends Response {
  locals: {
    permission?: string;
    jwt?: string;
    permissions?: string[];
  };
}

export default ResponseType;
