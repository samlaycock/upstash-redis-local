import { json } from "body-parser";
import express from "express";
import morgan from "morgan";

import * as redis from "./endpoints/redis";
import { PORT } from "./env";

const app = express();

app.use(morgan("tiny"));
app.use(json());

app.post("/pipeline", json(), redis.pipeline);

app.post("multi-exec", json(), redis.transaction);

app.post("*", json(), redis.command);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Upstash Redis Local listening at http://0.0.0.0:${PORT}`);
});
