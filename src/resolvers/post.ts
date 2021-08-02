import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
// import { Upvote } from "src/entities/Upvote";
import { Upvote } from "../entities/Upvote";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String) 
  textSnippet(
    @Root() root: Post
  ) {
    return root.text.slice(0, 50)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId' , () => Int) postId: number,
    @Arg('value' , () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpvote = value !== -1; 
    const realValue = isUpvote ? 1 : -1;
    const { userId } = req.session;
    const upvote = await Upvote.findOne({where: { postId, userId }}) 

    if (upvote && upvote.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
          update upvote 
          set value = $1
          where "postId" = $2 and "userId" = $3
        `, [realValue,postId,userId]);


        await tm.query(`
          update post
          set points = points + $1
          where id = $2;
        `, [2* realValue, postId]);
        })
        


    } else if (!upvote) {
      await getConnection().transaction(async tm => {
        await tm.query(`
          insert into upvote ("userId", "postId", value)
          values ($1, $2, $3);
        `, [userId,postId,realValue]);

        await tm.query(`
          update post
          set points = points + $1
          where id = $2;
        `, [realValue,postId]);
      });
    }

    // await getConnection().query(`
    //   START TRANSACTION;
    //   insert into upvote ("userId", "postId", value)
    //   values (${userId},${postId},${realValue});
    //   update post
    //   set points = points + ${realValue}
    //   where id = ${postId};
    //   COMMIT;
    // `);

    // return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() {req}: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne, req.session.userId];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const posts = await getConnection().query(`
      select p.*, 
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
      ) Creator,
      ${req.session.userId ? '(select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"' : 'null as "voteStatus"'}
      from post p
      inner join public.user u on u.id = p."CreatorId"
      ${cursor ? `where p."createdAt" < $3 ` : ""}
      order by p."createdAt" DESC
      limit $1
    `, replacements)

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("post")
    //   .innerJoinAndSelect(
    //     "post.creator", 
    //     "u", 
    //     'u.id = post."CreatorId"',
    //   )
    //   .orderBy('post."createdAt"', "DESC")
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('post."createdAt" < :cursor', { 
    //     cursor: new Date(parseInt(cursor)) 
    //   });
    // }

    // const posts = await qb.getMany();

    return { 
      posts: posts.slice(0, realLimit), 
      hasMore: posts.length === realLimitPlusOne 
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      CreatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
