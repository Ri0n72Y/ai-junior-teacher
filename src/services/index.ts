import axios from "axios";
import * as jose from "jose";

const header = {
  alg: "HS256",
  sign_type: "SIGN",
};

const JWT_KEY = "JWT_KEY";
const JWT_EXPIRE = "JWT_EXPIRE";
export async function getJwt() {
  const expire = window.localStorage.getItem(JWT_EXPIRE) ?? "";
  if (!expire || new Date(expire).getTime() < new Date().getTime()) {
    const key = (import.meta.env.VITE_API_KEY as string).split(".");
    const payload = {
      api_key: key[0],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 3,
      timestamp: Date.now(),
    };
    const secret = new TextEncoder().encode(key[1]);
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader(header)
      .sign(secret);
    return token;
  }
  return window.localStorage.getItem(JWT_KEY) ?? "";
}

export async function chat(msg: string) {
  return await axios.post(
    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    {
      model: "glm-4",
      messages: [
        {
          role: "user",
          content: msg,
        },
      ],
    }
  );
}
