// function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
//     return arr1.concat(arr2);
//   }

// const arr = combine<string | number >([1, 2, 3], ["hello"]);



import {MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(microConfig);

    const post = orm.em.create(Post, { title: 'my posts'});
    await orm.em.persistAndFlush(post);
}

main()






 