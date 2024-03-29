import { MikroORM } from "@mikro-orm";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
  const post = orm.em.create(Post, { title: "my posts" });
  await orm.em.persistAndFlush(post);
};
main();

