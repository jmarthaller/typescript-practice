import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
// import { RedisClient } from "redis";
import { Redis } from "ioredis";


export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: any };
    // MAYBE THIS req: Request & { session: Express.Session };
    redis: Redis;
    res: Response;
}