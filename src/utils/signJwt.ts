import * as jose from "jose";
import JwtPayloadType from "../types/JwtPayloadType";

const signJwt = async (user_id: number): Promise<string> => {
  const tokenSecret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({
    user_id: user_id,
    randomizer: new Date().getTime(),
  } as JwtPayloadType)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6 hours")
    .sign(tokenSecret);

  return token;
};

export default signJwt;
