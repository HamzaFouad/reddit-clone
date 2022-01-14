import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import dotenv from "dotenv";
import { User } from "./entities/User";

dotenv.config();

console.log(path.join(__dirname, "./migrations"));
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  debug: !__prod__,
  type: "postgresql",
  dbName: `${process.env.DB}`,
  user: `${process.env.POSTGRESQL_USERNAME}`,
  password: `${process.env.POSTGRESQL_PASSWORD}`,
} as Parameters<typeof MikroORM.init>[0];
