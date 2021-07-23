import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  // OneToMany,
} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
import { User } from "./User";
// import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  CreatorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;

  // @OneToMany(() => Upvote, (upvote) => upvote.post)
  // upvotes: Upvote[];

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;
}
