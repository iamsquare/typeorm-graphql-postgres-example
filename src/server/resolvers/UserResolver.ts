import { mergeRight } from 'ramda';
import {
  Arg,
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Subscription
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Min, Max } from 'class-validator';
import { User } from '../../orm';
import { DeleteResult } from '../utils/DecoratedReturnTypes';

const USERS_TOPIC = 'USERS';

@ArgsType()
class GetUsersArgs {
  @Field({ defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field()
  @Min(1)
  @Max(100)
  take: number = 25;
}

@InputType()
class AddUserInput implements Partial<User> {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}

@InputType()
class UpdateUserInput extends AddUserInput {}

export class UserResolver {
  @InjectRepository(User) private readonly _userRepository: Repository<User>;

  @Query(() => [User])
  async users(@Args() { skip, take }: GetUsersArgs): Promise<User[]> {
    return await this._userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  async createUser(@Arg('user') data: AddUserInput, @PubSub() pubSub: PubSubEngine): Promise<User> {
    const user = await this._userRepository.save(data);

    await pubSub.publish(USERS_TOPIC, {});

    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id') id: string,
    @Arg('user') data: UpdateUserInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<User> {
    const user = await this._userRepository.findOne(id).catch(() => {
      throw Error(`No User for ID: ${id}`);
    });
    const newUser = await this._userRepository.save(mergeRight(user, data));

    await pubSub.publish(USERS_TOPIC, {});

    return newUser;
  }

  @Mutation(() => DeleteResult)
  async deleteUser(@Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<DeleteResult> {
    const result = await this._userRepository.delete(id);

    await pubSub.publish(USERS_TOPIC, {});

    return result;
  }

  @Subscription(() => [User], {
    topics: USERS_TOPIC
  })
  async usersSubscription(): Promise<User[]> {
    return await this._userRepository.find();
  }
}
