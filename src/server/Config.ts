import { useContainer, createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers';

export const typeormInit = (container = null) => {
  container && useContainer(container);
  createConnection();
};

export const schemaPromise = (container = null) =>
  buildSchema({
    resolvers: [UserResolver],
    container
  });
