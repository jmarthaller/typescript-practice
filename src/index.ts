import {MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    orm.getMigrator().up();

    const app = express();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [],
            validate: false
        })
    });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
    // const post = orm.em.create(Post, { title: 'amy'});
    // await orm.em.persistAndFlush(post);
}
main()






