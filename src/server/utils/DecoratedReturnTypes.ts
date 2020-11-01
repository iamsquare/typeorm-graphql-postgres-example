import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class DeleteResult {
  @Field({ nullable: true })
  affected?: number;
}
