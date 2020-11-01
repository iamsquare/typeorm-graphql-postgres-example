import { Field, ObjectType } from 'type-graphql';
import { Entity, Column } from 'typeorm';
import { AbstractBaseEntity } from '../abstract';

@Entity()
@ObjectType({ implements: AbstractBaseEntity })
export class User extends AbstractBaseEntity {
  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;
}
