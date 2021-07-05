// import { MyContext } from 'src/types';
import { MyContext } from 'src/types';
import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx } from 'type-graphql';
import { Post } from '../entities/Post';
// import { sleep } from '../utils/sleep';

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}


@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post, {nullable: true})
    post(@Arg('id') id: number): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: MyContext
        ): Promise<Post> {

        if (!req.session.userId) {
            throw new Error("you are not logged in!")
        }    
        
        return Post.create({
            ...input,
            CreatorId: req.session.userId,
        }).save();
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String) title: string): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post) {
            return null;
        }  
        if (typeof title !== undefined) {
            await Post.update({id}, {title})
        }
        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number): Promise<boolean> {
        await Post.delete(id)
        return true;
    }
}