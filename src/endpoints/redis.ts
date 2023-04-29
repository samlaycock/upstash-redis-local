import { type Request, type Response } from "express";
import { createClient } from "redis";

import { REDIS_URL } from "../env";

const client = createClient({
  url: REDIS_URL,
  database: 0,
});

const connection = client.connect();

export async function pipeline(req: Request, res: Response) {
  const { body } = req;
  const commands = body as [string, string][];

  try {
    await connection;

    const redisRes = await Promise.all(
      commands.map((command) => {
        const [name, ...args] = command;

        client.sendCommand([name?.toUpperCase(), ...args]);
      })
    );

    return res.json(redisRes.map((result) => ({ result })));
  } catch (_) {
    console.error(_);

    return res.status(500).json({ error: (_ as Error).message });
  }
}

export async function transaction(req: Request, res: Response) {
  const { body } = req;
  const commands = body as string[][];

  try {
    await connection;

    let redisCall = client.multi();

    for (const command of commands) {
      // @ts-ignore-next-line
      redisCall = redisCall[command[0]!.toUpperCase()](...command.slice(1));
    }

    const redisRes = await redisCall.exec();

    return res.json(redisRes.map((result) => ({ result })));
  } catch (_) {
    console.error(_);

    return res.status(500).json({ error: (_ as Error).message });
  }
}

export async function command(req: Request, res: Response) {
  const { body, path } = req;
  const args = Array.isArray(body) ? body : path.slice(1).split("/");

  if (args.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    await connection;

    const redisRes = await client.sendCommand(args);

    return res.json({ result: redisRes });
  } catch (_) {
    console.error(_);

    return res.status(500).json({ error: (_ as Error).message });
  }
}
