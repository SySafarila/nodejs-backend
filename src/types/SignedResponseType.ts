import { Response } from "express";

interface SignedResponseType extends Response {
  locals: {
    user_id?: number;
    jwt?: string;
    permissions?: string[];
    roles?: string[];
  };
}

export default SignedResponseType;
