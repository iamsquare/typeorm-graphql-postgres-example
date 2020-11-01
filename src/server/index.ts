import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import { schemaPromise, typeormInit } from './Config';

async function main() {
  typeormInit(Container);
  const server = new ApolloServer({ schema: await schemaPromise(Container), playground: true });

  await server.listen(4000);
  console.log('Server has started - http://localhost:4000');
}

main();
