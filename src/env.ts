import env from "env-var";

export const REDIS_URL = env.get("REDIS_URL").required().asUrlString();
export const PORT = env.get("PORT").default("8080").asPortNumber();
