import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TaskType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  completedAt?: string;
}
